import { useState, useEffect } from 'react'
import { AdminNavbar } from '../../components/AdminNavbar'
import { usersApi } from '../../api/users'
import { Shield, UserMinus, UserCheck, Plus, Minus, Search, Award } from 'react-feather'
import {
  Container,
  Header,
  Title,
  FilterBar,
  SearchInputWrapper,
  SearchInput,
  SelectFilter,
  UserTable,
  Th,
  Td,
  LoadingWrap,
  ErrorWrap,
  UserAvatar,
  UserInfoCell,
  Badge,
  ActionButton,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea
} from './AdminUsersPage.styles'

export function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('') // '', 'admin', 'user'
  const [statusFilter, setStatusFilter] = useState('') // '', 'active', 'inactive'

  // Points Modal State
  const [selectedUser, setSelectedUser] = useState(null)
  const [pointsDelta, setPointsDelta] = useState('50')
  const [pointsReason, setPointsReason] = useState('Thưởng điểm tri ân khách hàng')
  const [adjustingPoints, setAdjustingPoints] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const params = { limit: 100 }
      if (search.trim()) params.q = search.trim()
      if (roleFilter === 'admin') params.is_superuser = true
      if (roleFilter === 'user') params.is_superuser = false
      if (statusFilter === 'active') params.is_active = true
      if (statusFilter === 'inactive') params.is_active = false

      const data = await usersApi.listAll(params)
      setUsers(data || [])
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách người dùng.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [search, roleFilter, statusFilter])

  const handleToggleStatus = async (user) => {
    try {
      const nextStatus = !user.is_active
      await usersApi.updateStatus(user.id, nextStatus)
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: nextStatus } : u))
    } catch (err) {
      alert(err.message || 'Không thể cập nhật trạng thái người dùng.')
    }
  }

  const handleToggleRole = async (user) => {
    try {
      const nextRole = !user.is_superuser
      const confirmMsg = nextRole
        ? `Xác nhận cấp quyền ADMIN cho người dùng ${user.full_name || user.username}?`
        : `Xác nhận gỡ quyền ADMIN của người dùng ${user.full_name || user.username}?`

      if (!window.confirm(confirmMsg)) return

      await usersApi.updateRole(user.id, nextRole)
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_superuser: nextRole } : u))
    } catch (err) {
      alert(err.message || 'Không thể cập nhật quyền hạn người dùng.')
    }
  }

  const handleOpenPointsModal = (user) => {
    setSelectedUser(user)
    setPointsDelta('50')
    setPointsReason('Thưởng điểm tri ân khách hàng')
  }

  const handleAdjustPointsSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUser) return
    try {
      setAdjustingPoints(true)
      const deltaNum = Number(pointsDelta)
      if (Number.isNaN(deltaNum) || deltaNum === 0) {
        alert('Số điểm thay đổi không hợp lệ!')
        return
      }

      await usersApi.adjustPoints(selectedUser.id, deltaNum, pointsReason)
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, loyalty_points: u.loyalty_points + deltaNum } : u))
      setSelectedUser(null)
    } catch (err) {
      alert(err.message || 'Lỗi khi điều chỉnh điểm.')
    } finally {
      setAdjustingPoints(false)
    }
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <Title>Người dùng</Title>
          <FilterBar>
            <SearchInputWrapper>
              <Search size={16} />
              <SearchInput
                type="text"
                placeholder="Tìm tên, email, username..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchInputWrapper>

            <SelectFilter value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Tất cả vai trò</option>
              <option value="admin">Quản trị viên (Admin)</option>
              <option value="user">Khách hàng (User)</option>
            </SelectFilter>

            <SelectFilter value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã khóa</option>
            </SelectFilter>
          </FilterBar>
        </Header>

        {error && <ErrorWrap>{error}</ErrorWrap>}

        {loading ? (
          <LoadingWrap>Đang tải danh sách người dùng...</LoadingWrap>
        ) : users.length === 0 ? (
          <LoadingWrap>Không tìm thấy người dùng phù hợp.</LoadingWrap>
        ) : (
          <UserTable>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Thông tin tài khoản</Th>
                <Th>Số điện thoại</Th>
                <Th>Vai trò</Th>
                <Th>Loyalty Points</Th>
                <Th>Trạng thái</Th>
                <Th style={{ textAlign: 'right' }}>Hành động</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <Td>#{user.id}</Td>
                  <Td>
                    <UserInfoCell>
                      <UserAvatar src={user.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'} alt={user.username} />
                      <div>
                        <div className="name">{user.full_name || 'Chưa cập nhật'}</div>
                        <div className="sub">@{user.username} • {user.email}</div>
                      </div>
                    </UserInfoCell>
                  </Td>
                  <Td>{user.phone_number || 'N/A'}</Td>
                  <Td>
                    <Badge $type={user.is_superuser ? 'admin' : 'user'}>
                      {user.is_superuser ? 'ADMIN' : 'USER'}
                    </Badge>
                  </Td>
                  <Td>
                    <strong style={{ color: 'var(--brand-900)' }}>{user.loyalty_points} pts</strong>
                  </Td>
                  <Td>
                    <Badge $type={user.is_active ? 'active' : 'inactive'}>
                      {user.is_active ? 'Hoạt động' : 'Bị khóa'}
                    </Badge>
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <ActionButton
                        title="Tặng/Trừ Điểm"
                        onClick={() => handleOpenPointsModal(user)}
                      >
                        <Award size={14} /> Điểm
                      </ActionButton>

                      <ActionButton
                        $variant="warning"
                        title={user.is_superuser ? 'Gỡ Admin' : 'Cấp Admin'}
                        onClick={() => handleToggleRole(user)}
                      >
                        <Shield size={14} /> Quyền
                      </ActionButton>

                      <ActionButton
                        $variant={user.is_active ? 'danger' : 'success'}
                        title={user.is_active ? 'Khóa User' : 'Kích hoạt User'}
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.is_active ? <UserMinus size={14} /> : <UserCheck size={14} />} Trạng thái
                      </ActionButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </UserTable>
        )}

        {/* Adjust Points Modal */}
        {selectedUser && (
          <ModalOverlay onClick={() => setSelectedUser(null)}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleAdjustPointsSubmit}>
                <ModalHeader>Điều chỉnh Loyalty Points</ModalHeader>
                <ModalBody>
                  <p style={{ marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
                    Đang điều chỉnh điểm cho: <strong>{selectedUser.full_name} (@{selectedUser.username})</strong>
                    <br />
                    Số điểm hiện tại: <strong>{selectedUser.loyalty_points} pts</strong>
                  </p>
                  <FormGroup>
                    <FormLabel>Số điểm cần thay đổi (Dùng dấu trừ để giảm điểm):</FormLabel>
                    <FormInput
                      type="number"
                      required
                      value={pointsDelta}
                      onChange={(e) => setPointsDelta(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Lý do điều chỉnh:</FormLabel>
                    <FormTextarea
                      required
                      rows={3}
                      value={pointsReason}
                      onChange={(e) => setPointsReason(e.target.value)}
                    />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <button type="button" className="btn-secondary" onClick={() => setSelectedUser(null)}>Hủy</button>
                  <button type="submit" className="btn-primary" disabled={adjustingPoints}>
                    {adjustingPoints ? 'Đang cập nhật...' : 'Xác nhận'}
                  </button>
                </ModalFooter>
              </form>
            </ModalContainer>
          </ModalOverlay>
        )}
      </Container>
    </>
  )
}

export default AdminUsersPage
