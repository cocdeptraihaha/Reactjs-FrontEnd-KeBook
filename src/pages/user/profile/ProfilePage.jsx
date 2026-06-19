import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit3,
  Headphones,
  Home,
  MapPin,
  MoreVertical,
  Package,
  Phone,
  Plus,
  Save,
  Star,
  Tag,
  Trash2,
  User,
  X,
  Shield,
} from 'react-feather'
import { addressesApi } from '../../../api/addresses'
import { authApi } from '../../../api/auth'
import { uploadApi } from '../../../api/upload'
import { usersApi } from '../../../api/users'
import { useAuth } from '../../../auth/auth-store'
import { Modal } from '../../../components/ui/Modal'
import {
  Shell,
  ProfileCanvas,
  Column,
  Hero,
  AvatarWrap,
  Avatar,
  AvatarFallback,
  HeroText,
  Name,
  Muted,
  StaticTile,
  TileLabel,
  TileValue,
  OutlineButton,
  DangerButton,
  NavTabs,
  NavTab,
  Card,
  CardHeader,
  CardTitle,
  IconButton,
  PointsCard,
  PointValue,
  AddressList,
  AddressItem,
  AddressIcon,
  AddressMain,
  AddressTitle,
  Badge,
  AddressText,
  Menu,
  SmallAction,
  SidePanel,
  SideLink,
  AdminPromoCard,
  AdminPromoTitle,
  AdminPromoDesc,
  AdminPromoBtn,
  FormPanel,
  FormTitle,
  FormGrid,
  Field,
  WideField,
  Label,
  Input,
  Select,
  CheckboxRow,
  Actions,
  ErrorText,
  StatusText,
  HiddenInput,
  EmptyState,
  AccountShell,
  AccountGrid
} from './ProfilePage.styles'

function toDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

function profilePayload(values) {
  return {
    full_name: values.full_name || null,
    gender: values.gender || null,
    date_of_birth: values.date_of_birth || null,
    address: values.address || null,
    province: values.province || null,
    ward: values.ward || null,
    avatar_url: values.avatar_url || null,
  }
}

function accountPayload(values) {
  return {
    email: values.email || null,
    phone_number: values.phone_number || null,
    ...(values.new_password ? { password: values.new_password } : {}),
  }
}

function addressPayload(values) {
  return {
    label: values.label || 'Home',
    recipient_name: values.recipient_name || null,
    phone_number: values.phone_number || null,
    address_detail: values.address_detail || null,
    ward: values.ward || null,
    province: values.province || null,
    is_default: Boolean(values.is_default),
  }
}

function getDisplayName(profile, user) {
  return profile?.full_name || user?.full_name || user?.username || 'Customer'
}

function getPoints(payload) {
  return Number(payload?.points ?? payload?.balance ?? payload?.total_points ?? payload?.available_points ?? 0)
}

function formatPoints(value) {
  return Number(value || 0).toLocaleString('vi-VN')
}

function formatAddress(address) {
  return [address?.address_detail, address?.ward, address?.province].filter(Boolean).join(', ')
}

const addressLabelOptions = ['Home', 'Office', 'Other']

function addressKind(address) {
  const label = address?.label || 'Home'
  if (label === 'Office') return { label, Icon: Briefcase }
  if (label === 'Other') return { label, Icon: MapPin }
  return { label: 'Home', Icon: Home }
}

const profileDefaults = {
  full_name: '',
  email: '',
  username: '',
  phone_number: '',
  gender: '',
  date_of_birth: '',
  address: '',
  province: '',
  ward: '',
  avatar_url: '',
}

const emptyAddress = {
  label: 'Home',
  recipient_name: '',
  phone_number: '',
  address_detail: '',
  province: '',
  ward: '',
  is_default: false,
}

function normalizeLocationName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function findLocationOption(options, currentValue) {
  const normalizedValue = normalizeLocationName(currentValue)
  if (!normalizedValue) return null

  return (options || []).find((option) => {
    const code = String(option?.code || option?.id || '')
    return (
      String(option?.name || '') === String(currentValue || '') ||
      code === String(currentValue || '') ||
      normalizeLocationName(option?.name) === normalizedValue
    )
  }) || null
}

export function ProfilePage() {
  const { user, logout, token } = useAuth()
  const queryClient = useQueryClient()
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const pendingAddressLocationRef = useRef(null)
  const [localAvatarPreview, setLocalAvatarPreview] = useState('')
  const [uploadError, setUploadError] = useState('')

  const profileQuery = useQuery({
    queryKey: ['me-profile'],
    queryFn: usersApi.me,
    staleTime: 30_000,
  })

  const pointsQuery = useQuery({
    queryKey: ['me-points'],
    queryFn: usersApi.myPoints,
    staleTime: 30_000,
  })

  const addressesQuery = useQuery({
    queryKey: ['address-book'],
    queryFn: addressesApi.mine,
    staleTime: 20_000,
  })

  const provincesQuery = useQuery({
    queryKey: ['address-provinces'],
    queryFn: addressesApi.provinces,
    staleTime: 10 * 60_000,
  })

  const profile = profileQuery.data || null
  const addresses = addressesQuery.data || []
  const displayName = getDisplayName(profile, user)
  const points = getPoints(pointsQuery.data)

  const formDefaults = useMemo(() => ({
    ...profileDefaults,
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    username: profile?.username || '',
    phone_number: profile?.phone_number || '',
    gender: profile?.gender || '',
    date_of_birth: toDateInput(profile?.date_of_birth),
    address: profile?.address || '',
    province: profile?.province || '',
    ward: profile?.ward || '',
    avatar_url: profile?.avatar_url || '',
  }), [profile])

  const profileForm = useForm({ values: formDefaults, defaultValues: profileDefaults })
  const avatarUrl = useWatch({ control: profileForm.control, name: 'avatar_url' })

  const addressForm = useForm({ defaultValues: emptyAddress })
  const selectedProvince = useWatch({ control: addressForm.control, name: 'province' })
  const selectedWard = useWatch({ control: addressForm.control, name: 'ward' })
  const selectedProvinceOption = useMemo(
    () => findLocationOption(provincesQuery.data, selectedProvince),
    [provincesQuery.data, selectedProvince],
  )
  const selectedProvinceCode = selectedProvinceOption?.code || selectedProvinceOption?.id

  const wardsQuery = useQuery({
    queryKey: ['address-wards', selectedProvinceCode],
    queryFn: () => addressesApi.wards(selectedProvinceCode),
    enabled: Boolean(selectedProvinceCode),
    staleTime: 10 * 60_000,
  })

  useEffect(() => () => {
    if (localAvatarPreview) URL.revokeObjectURL(localAvatarPreview)
  }, [localAvatarPreview])

  useEffect(() => {
    const pendingAddressLocation = pendingAddressLocationRef.current
    if (!showAddressForm || !pendingAddressLocation || provincesQuery.isLoading) return
    const provinceOption = findLocationOption(provincesQuery.data, pendingAddressLocation.province)
    const provinceValue = provinceOption?.name || pendingAddressLocation.province || ''

    addressForm.setValue('province', provinceValue, { shouldDirty: false, shouldValidate: true })
    addressForm.setValue('ward', '', { shouldDirty: false, shouldValidate: false })

    if (!provinceOption) {
      addressForm.setValue('ward', pendingAddressLocation.ward || '', { shouldDirty: false, shouldValidate: true })
      pendingAddressLocationRef.current = null
    }
  }, [addressForm, editingAddress?.id, provincesQuery.data, provincesQuery.isLoading, showAddressForm])

  useEffect(() => {
    const pendingAddressLocation = pendingAddressLocationRef.current
    if (!showAddressForm || !pendingAddressLocation || !selectedProvinceCode) return
    if (wardsQuery.isLoading || wardsQuery.isFetching) return

    const wardOption = findLocationOption(wardsQuery.data, pendingAddressLocation.ward)
    addressForm.setValue('ward', wardOption?.name || pendingAddressLocation.ward || '', { shouldDirty: false, shouldValidate: true })
    pendingAddressLocationRef.current = null
  }, [
    addressForm,
    editingAddress?.id,
    selectedProvinceCode,
    showAddressForm,
    wardsQuery.data,
    wardsQuery.isFetching,
    wardsQuery.isLoading,
  ])

  const saveProfileMutation = useMutation({
    mutationFn: async (values) => {
      if (!profile?.id) throw new Error('User id missing')
      return usersApi.update(profile.id, profilePayload(values))
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me-profile'] })
      setEditingProfile(false)
      setLocalAvatarPreview('')
    },
  })

  const avatarUploadMutation = useMutation({
    mutationFn: async (file) => uploadApi.avatar(file, token),
    onSuccess: (uploaded) => {
      const rawUrl = uploaded?.avatar_url || uploaded?.url || ''
      if (!rawUrl) return
      const sep = rawUrl.includes('?') ? '&' : '?'
      profileForm.setValue('avatar_url', `${rawUrl}${sep}t=${Date.now()}`, { shouldDirty: true })
      setUploadError('')
    },
    onError: (error) => {
      setUploadError(error.message || 'Upload avatar failed')
    },
  })

  const createAddressMutation = useMutation({
    mutationFn: (values) => addressesApi.create(addressPayload(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['address-book'] })
      closeAddressForm()
    },
  })

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, values }) => addressesApi.update(id, addressPayload(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['address-book'] })
      closeAddressForm()
    },
  })

  const defaultAddressMutation = useMutation({
    mutationFn: (addressId) => addressesApi.setDefault(addressId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['address-book'] }),
  })

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId) => addressesApi.remove(addressId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['address-book'] })
      closeAddressForm()
    },
  })

  function closeAddressForm() {
    setEditingAddress(null)
    setShowAddressForm(false)
    pendingAddressLocationRef.current = null
    addressForm.reset(emptyAddress)
  }

  function openNewAddressForm() {
    setEditingAddress(null)
    pendingAddressLocationRef.current = null
    setShowAddressForm(true)
    addressForm.reset({
      ...emptyAddress,
      label: 'Home',
      recipient_name: profile?.full_name || '',
      phone_number: profile?.phone_number || '',
      is_default: addresses.length === 0,
    })
  }

  function openEditAddressForm(address) {
    setEditingAddress(address)
    pendingAddressLocationRef.current = {
      province: address?.province || '',
      ward: address?.ward || '',
    }
    setShowAddressForm(true)
    addressForm.reset({
      label: address?.label || 'Home',
      recipient_name: address?.recipient_name || '',
      phone_number: address?.phone_number || '',
      address_detail: address?.address_detail || '',
      province: '',
      ward: '',
      is_default: Boolean(address?.is_default),
    })
  }

  async function handleAvatarFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (localAvatarPreview) URL.revokeObjectURL(localAvatarPreview)
    const previewUrl = URL.createObjectURL(file)
    setLocalAvatarPreview(previewUrl)
    await avatarUploadMutation.mutateAsync(file)
  }

  const submitProfile = profileForm.handleSubmit(async (values) => {
    await saveProfileMutation.mutateAsync(values)
  })

  const submitAddress = addressForm.handleSubmit(async (values) => {
    if (editingAddress?.id) {
      await updateAddressMutation.mutateAsync({ id: editingAddress.id, values })
      return
    }
    await createAddressMutation.mutateAsync(values)
  })

  const addressMutationError =
    createAddressMutation.error?.message ||
    updateAddressMutation.error?.message ||
    defaultAddressMutation.error?.message ||
    deleteAddressMutation.error?.message

  return (
    <Shell>
      <Hero>
        <AvatarWrap>
          {localAvatarPreview || avatarUrl ? (
            <Avatar src={localAvatarPreview || avatarUrl} alt={`${displayName} avatar`} />
          ) : (
            <AvatarFallback size={78} aria-hidden="true" />
          )}
        </AvatarWrap>
        <HeroText>
          <Name>{displayName}</Name>
          <Muted>{profile?.phone_number || 'No phone number'}</Muted>
          <Muted>{profile?.email || user?.email || 'No email'}</Muted>
        </HeroText>
      </Hero>

      <ProfileCanvas>
        <Column>
          <StaticTile>
            <User size={26} />
            <span>
              <TileLabel>Name</TileLabel>
              <TileValue>{displayName}</TileValue>
            </span>
          </StaticTile>
          <StaticTile>
            <Phone size={26} />
            <span>
              <TileLabel>Phone</TileLabel>
              <TileValue>{profile?.phone_number || 'Add phone'}</TileValue>
            </span>
          </StaticTile>
          <StaticTile>
            <Calendar size={26} />
            <span>
              <TileLabel>DOB</TileLabel>
              <TileValue>{toDateInput(profile?.date_of_birth) || 'Add birthday'}</TileValue>
            </span>
          </StaticTile>

          <OutlineButton type="button" onClick={() => setEditingProfile(true)}>
            <Edit3 size={20} /> Edit profile info
          </OutlineButton>
          <OutlineButton type="button" as={Link} to="/app/profile/account">
            <Edit3 size={20} /> Edit account info
          </OutlineButton>
          <DangerButton type="button" onClick={() => logout()}>
            <X size={20} /> Logout
          </DangerButton>
        </Column>

        <Column>
          <NavTabs aria-label="Profile shortcuts">
            <NavTab to="/app/orders"><Package size={38} /> Order</NavTab>
            <NavTab to="/app/profile/favorites"><Star size={40} /> Wishlist</NavTab>
          </NavTabs>

          <PointsCard>
            <div>
              <Muted>Point</Muted>
              <PointValue>{pointsQuery.isLoading ? '...' : formatPoints(points)}</PointValue>
            </div>
            <OutlineButton type="button" as={Link} to="/app/profile/rewards">
              Point Use <ChevronRight size={18} />
            </OutlineButton>
          </PointsCard>

          <Card>
            <CardHeader>
              <CardTitle>Address list</CardTitle>
              <IconButton type="button" onClick={openNewAddressForm} aria-label="Add address">
                <Plus size={30} />
              </IconButton>
            </CardHeader>
            {addressesQuery.isLoading && <EmptyState>Loading addresses...</EmptyState>}
            {addressesQuery.error && <EmptyState role="alert">{addressesQuery.error.message || 'Failed to load addresses'}</EmptyState>}
            {!addressesQuery.isLoading && !addressesQuery.error && addresses.length === 0 && (
              <EmptyState>
                <strong>No saved address.</strong>
                <span>Add delivery information once, then reuse it at checkout.</span>
              </EmptyState>
            )}
            {addresses.length > 0 && (
              <AddressList>
                {addresses.map((address, index) => {
                  const { label, Icon } = addressKind(address)
                  return (
                    <AddressItem key={address.id || `${address.address_detail}-${index}`}>
                      <AddressIcon><Icon size={26} /></AddressIcon>
                      <AddressMain>
                        <AddressTitle>
                          {label}
                          {address.is_default && <Badge>Default</Badge>}
                        </AddressTitle>
                        <AddressText>{address.recipient_name}</AddressText>
                        <AddressText>{formatAddress(address)}</AddressText>
                        <AddressText>{address.phone_number}</AddressText>
                      </AddressMain>
                      <Menu>
                        {!address.is_default && (
                          <SmallAction
                            type="button"
                            onClick={() => defaultAddressMutation.mutate(address.id)}
                            disabled={defaultAddressMutation.isPending}
                          >
                            Set default
                          </SmallAction>
                        )}
                        <IconButton type="button" onClick={() => openEditAddressForm(address)} aria-label="Edit address">
                          <MoreVertical size={24} />
                        </IconButton>
                      </Menu>
                    </AddressItem>
                  )
                })}
              </AddressList>
            )}
          </Card>

          {showAddressForm && (
            <Modal
              labelledBy="address-modal-title"
              onClose={closeAddressForm}
              title={<FormTitle id="address-modal-title">{editingAddress ? 'Edit address' : 'Add address'}</FormTitle>}
            >
              <form onSubmit={submitAddress}>
                <FormGrid>
                  <WideField>
                    <Label>Address type</Label>
                    <Select {...addressForm.register('label')}>
                      {addressLabelOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </WideField>
                  <Field>
                    <Label>Recipient name</Label>
                    <Input {...addressForm.register('recipient_name', { required: 'Recipient name required' })} />
                    {addressForm.formState.errors.recipient_name && <ErrorText>{addressForm.formState.errors.recipient_name.message}</ErrorText>}
                  </Field>
                  <Field>
                    <Label>Phone number</Label>
                    <Input {...addressForm.register('phone_number', { required: 'Phone number required' })} />
                    {addressForm.formState.errors.phone_number && <ErrorText>{addressForm.formState.errors.phone_number.message}</ErrorText>}
                  </Field>
                  <Field>
                    <Label>Province</Label>
                    <Select {...addressForm.register('province', { required: 'Province required' })}>
                      <option value="">Select province</option>
                      {selectedProvince && !provincesQuery.data?.some((province) => province.name === selectedProvince) && (
                        <option value={selectedProvince}>{selectedProvince}</option>
                      )}
                      {provincesQuery.data?.map((province) => (
                        <option key={province.code || province.name} value={province.name}>{province.name}</option>
                      ))}
                    </Select>
                    {addressForm.formState.errors.province && <ErrorText>{addressForm.formState.errors.province.message}</ErrorText>}
                  </Field>
                  <Field>
                    <Label>Ward</Label>
                    <Select {...addressForm.register('ward', { required: 'Ward required' })}>
                      <option value="">{selectedProvinceCode ? 'Select ward' : 'Select province first'}</option>
                      {selectedWard && !wardsQuery.data?.some((ward) => ward.name === selectedWard) && (
                        <option value={selectedWard}>{selectedWard}</option>
                      )}
                      {wardsQuery.data?.map((ward) => (
                        <option key={ward.code || ward.name} value={ward.name}>{ward.name}</option>
                      ))}
                    </Select>
                    {addressForm.formState.errors.ward && <ErrorText>{addressForm.formState.errors.ward.message}</ErrorText>}
                  </Field>
                  <WideField>
                    <Label>Address detail</Label>
                    <Input {...addressForm.register('address_detail', { required: 'Address detail required' })} />
                    {addressForm.formState.errors.address_detail && <ErrorText>{addressForm.formState.errors.address_detail.message}</ErrorText>}
                  </WideField>
                  <WideField>
                    <CheckboxRow>
                      <input type="checkbox" {...addressForm.register('is_default')} />
                      Use as default delivery address
                    </CheckboxRow>
                  </WideField>
                </FormGrid>
                <Actions>
                  <OutlineButton
                    type="submit"
                    disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                  >
                    <Save size={18} /> Save address
                  </OutlineButton>
                  {editingAddress?.id && (
                    <DangerButton
                      type="button"
                      onClick={() => deleteAddressMutation.mutate(editingAddress.id)}
                      disabled={deleteAddressMutation.isPending}
                    >
                      <Trash2 size={18} /> Delete
                    </DangerButton>
                  )}
                  <OutlineButton type="button" onClick={closeAddressForm}>
                    <X size={18} /> Cancel
                  </OutlineButton>
                </Actions>
                {addressMutationError && <ErrorText role="alert">{addressMutationError}</ErrorText>}
              </form>
            </Modal>
          )}

          {editingProfile && (
            <Modal
              labelledBy="profile-modal-title"
              onClose={() => {
                profileForm.reset(formDefaults)
                setEditingProfile(false)
                setUploadError('')
                setLocalAvatarPreview('')
              }}
              title={<FormTitle id="profile-modal-title">Edit profile info</FormTitle>}
            >
              <form onSubmit={submitProfile}>
                <FormGrid>
                  <Field>
                    <Label>Full name</Label>
                    <Input {...profileForm.register('full_name', { required: 'Full name required' })} />
                    {profileForm.formState.errors.full_name && <ErrorText>{profileForm.formState.errors.full_name.message}</ErrorText>}
                  </Field>
                  <Field>
                    <Label>Gender</Label>
                    <Select {...profileForm.register('gender')}>
                      <option value="">Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </Field>
                  <Field>
                    <Label>Date of birth</Label>
                    <Input type="date" {...profileForm.register('date_of_birth')} />
                  </Field>
                  <WideField>
                    <Label>Legacy address</Label>
                    <Input {...profileForm.register('address')} />
                  </WideField>
                  <WideField>
                    <Label>Avatar URL</Label>
                    <Input {...profileForm.register('avatar_url')} />
                  </WideField>
                  <WideField>
                    <Label>Upload avatar</Label>
                    <OutlineButton type="button" as="label">
                      <Edit3 size={18} /> Choose image
                      <HiddenInput type="file" accept="image/*" onChange={(event) => void handleAvatarFileChange(event)} />
                    </OutlineButton>
                  </WideField>
                </FormGrid>
                <Actions>
                  <OutlineButton type="submit" disabled={saveProfileMutation.isPending || !profileForm.formState.isDirty}>
                    <CheckCircle size={18} /> Save changes
                  </OutlineButton>
                  <OutlineButton
                    type="button"
                    onClick={() => {
                      profileForm.reset(formDefaults)
                      setEditingProfile(false)
                      setUploadError('')
                      setLocalAvatarPreview('')
                    }}
                    disabled={saveProfileMutation.isPending}
                  >
                    <X size={18} /> Cancel
                  </OutlineButton>
                </Actions>
                {avatarUploadMutation.isPending && <StatusText>Uploading avatar...</StatusText>}
                {uploadError && <ErrorText role="alert">{uploadError}</ErrorText>}
                {saveProfileMutation.isPending && <StatusText>Saving profile...</StatusText>}
                {saveProfileMutation.isError && <ErrorText role="alert">{saveProfileMutation.error.message || 'Save failed'}</ErrorText>}
              </form>
            </Modal>
          )}
        </Column>

        <Column>
          {(user?.is_superuser === true || String(user?.role || '').toUpperCase() === 'ADMIN') && (
            <AdminPromoCard>
              <AdminPromoTitle><Shield size={24} /> Admin Workspace</AdminPromoTitle>
              <AdminPromoDesc>
                You have administrative privileges. Access the management panel to oversee orders, stock catalogs, and analyze business performance.
              </AdminPromoDesc>
              <AdminPromoBtn to="/app/admin/dashboard">
                Go to Dashboard <ChevronRight size={16} />
              </AdminPromoBtn>
            </AdminPromoCard>
          )}

          <SidePanel>
            <SideLink to="/app/profile/points-history"><Clock size={28} /> History <ChevronRight size={22} /></SideLink>
            <SideLink to="/app/profile/my-vouchers"><Tag size={28} /> Vouchers <ChevronRight size={22} /></SideLink>
            <SideLink to="/app/profile/support-ticket"><Headphones size={28} /> Support ticket <ChevronRight size={22} /></SideLink>
          </SidePanel>
        </Column>
      </ProfileCanvas>

      {profileQuery.isLoading && <StatusText>Loading profile...</StatusText>}
      {profileQuery.error && <ErrorText role="alert">{profileQuery.error.message || 'Failed to load profile'}</ErrorText>}
    </Shell>
  )
}

export function AccountSettingsPage() {
  const { user, replaceUser } = useAuth()
  const queryClient = useQueryClient()
  const [success, setSuccess] = useState('')

  const profileQuery = useQuery({
    queryKey: ['me-profile'],
    queryFn: usersApi.me,
    staleTime: 30_000,
  })

  const profile = profileQuery.data || null
  const defaults = useMemo(() => ({
    email: profile?.email || user?.email || '',
    phone_number: profile?.phone_number || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  }), [profile, user])

  const accountForm = useForm({ values: defaults, defaultValues: defaults })

  const saveAccountMutation = useMutation({
    mutationFn: async (values) => {
      if (!profile?.id) throw new Error('User id missing')
      const identifier = profile?.email || profile?.username || user?.email || user?.username
      if (!identifier) throw new Error('Cannot identify current account')
      await authApi.login(identifier, values.current_password)
      return usersApi.update(profile.id, accountPayload(values))
    },
    onSuccess: async (updatedUser) => {
      replaceUser?.(updatedUser)
      await queryClient.invalidateQueries({ queryKey: ['me-profile'] })
      setSuccess('Account info updated.')
      accountForm.reset({
        email: updatedUser?.email || '',
        phone_number: updatedUser?.phone_number || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
      })
    },
  })

  const submitAccount = accountForm.handleSubmit(async (values) => {
    setSuccess('')
    if (values.new_password && values.new_password !== values.confirm_password) {
      accountForm.setError('confirm_password', { message: 'Password confirmation does not match' })
      return
    }
    await saveAccountMutation.mutateAsync(values)
  })

  return (
    <AccountShell>
      <Hero>
        <AvatarWrap>
          {profile?.avatar_url ? (
            <Avatar src={profile.avatar_url} alt={`${getDisplayName(profile, user)} avatar`} />
          ) : (
            <AvatarFallback size={78} aria-hidden="true" />
          )}
        </AvatarWrap>
        <HeroText>
          <Name>Account info</Name>
          <Muted>Re-authentication required before changing Gmail, phone number, or password.</Muted>
        </HeroText>
      </Hero>

      <AccountGrid>
        <FormPanel>
          <FormTitle>Edit account info</FormTitle>
          <form onSubmit={submitAccount}>
            <FormGrid>
              <WideField>
                <Label>Current password</Label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  {...accountForm.register('current_password', { required: 'Current password required' })}
                />
                {accountForm.formState.errors.current_password && <ErrorText>{accountForm.formState.errors.current_password.message}</ErrorText>}
              </WideField>
              <Field>
                <Label>Gmail / Email</Label>
                <Input
                  type="email"
                  autoComplete="email"
                  {...accountForm.register('email', { required: 'Email required' })}
                />
              </Field>
              <Field>
                <Label>Phone number</Label>
                <Input autoComplete="tel" {...accountForm.register('phone_number')} />
              </Field>
              <Field>
                <Label>New password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current password"
                  {...accountForm.register('new_password', { minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                />
                {accountForm.formState.errors.new_password && <ErrorText>{accountForm.formState.errors.new_password.message}</ErrorText>}
              </Field>
              <Field>
                <Label>Confirm new password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat new password"
                  {...accountForm.register('confirm_password')}
                />
                {accountForm.formState.errors.confirm_password && <ErrorText>{accountForm.formState.errors.confirm_password.message}</ErrorText>}
              </Field>
            </FormGrid>
            <Actions>
              <OutlineButton type="submit" disabled={saveAccountMutation.isPending || profileQuery.isLoading}>
                <Save size={18} /> Save account info
              </OutlineButton>
              <OutlineButton type="button" as={Link} to="/app/profile">
                <ChevronRight size={18} /> Back to profile
              </OutlineButton>
            </Actions>
            {profileQuery.isLoading && <StatusText>Loading account...</StatusText>}
            {saveAccountMutation.isPending && <StatusText>Verifying password and saving...</StatusText>}
            {success && <StatusText>{success}</StatusText>}
            {profileQuery.error && <ErrorText role="alert">{profileQuery.error.message || 'Failed to load account'}</ErrorText>}
            {saveAccountMutation.isError && <ErrorText role="alert">{saveAccountMutation.error.message || 'Account update failed'}</ErrorText>}
          </form>
        </FormPanel>

        <Card>
          <CardHeader>
            <CardTitle>Security note</CardTitle>
          </CardHeader>
          <EmptyState>
            <strong>Why current password?</strong>
            <span>Gmail, phone number, and password changes affect sign-in and order contact data, so the page verifies your current credentials first.</span>
          </EmptyState>
        </Card>
      </AccountGrid>
    </AccountShell>
  )
}
