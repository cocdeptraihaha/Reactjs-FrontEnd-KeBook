import { useState, useEffect } from 'react'
import { AdminNavbar } from '../../components/AdminNavbar'
import { notificationsApi } from '../../api/notifications'
import { usersApi } from '../../api/users'
import { Send, Radio, User, Bell, Mail, Clock, AlertTriangle } from 'react-feather'
import {
  Container,
  Header,
  Title,
  Grid,
  Panel,
  PanelTitle,
  FormGroup,
  FormLabel,
  FormInput,
  FormTextarea,
  RadioGroup,
  RadioLabel,
  SubmitButton,
  NotificationList,
  NotificationItem,
  IconWrap,
  NotifContent,
  NotifTitle,
  NotifMessage,
  NotifMeta,
  MultiSelectWrapper,
  SelectAllCheckbox,
  UserCheckList,
  UserCheckItem
} from './AdminNotificationsPage.styles'

export function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  // Send State
  const [targetType, setTargetType] = useState('broadcast') // 'broadcast' or 'direct'
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('GENERIC') // 'GENERIC', 'SUPPORT_NEW', etc.

  const loadData = async () => {
    try {
      setLoading(true)
      const [notifsData, usersData] = await Promise.all([
        notificationsApi.adminList({ limit: 50 }).catch(err => {
          console.error('Error fetching admin notifications:', err)
          return []
        }),
        usersApi.listAll({ limit: 100 }).catch(err => {
          console.error('Error fetching admin users:', err)
          return []
        })
      ])
      setNotifications(Array.isArray(notifsData) ? notifsData : [])
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu thông báo:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleUserToggle = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(users.map(u => u.id))
    } else {
      setSelectedUserIds([])
    }
  }

  const handleSendNotification = async (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung!')
      return
    }

    try {
      setSending(true)
      let responseNotif
      if (targetType === 'broadcast') {
        responseNotif = await notificationsApi.adminBroadcast(title, message, type)
      } else {
        if (selectedUserIds.length === 0) {
          alert('Vui lòng chọn ít nhất 1 người nhận!')
          return
        }
        responseNotif = await notificationsApi.adminSend(selectedUserIds, title, message, type)
      }

      alert('Đã gửi thông báo thành công!')
      setTitle('')
      setMessage('')
      setSelectedUserIds([])

      // Reload notifications list
      const freshNotifs = await notificationsApi.adminList({ limit: 50 })
      setNotifications(freshNotifs || [])
    } catch (err) {
      alert(err.message || 'Lỗi khi gửi thông báo.')
    } finally {
      setSending(false)
    }
  }

  const getIconFromType = (type) => {
    switch (type) {
      case 'ORDER_NEW':
      case 'ORDER_SHIPMENT':
        return <Mail size={16} />
      case 'SUPPORT_NEW':
        return <AlertTriangle size={16} />
      default:
        return <Bell size={16} />
    }
  }

  return (
    <>
      <AdminNavbar />
      <Container>
        <Header>
          <Title>Trung Tâm Gửi Thông Báo</Title>
        </Header>

        <Grid>
          {/* Panel Form Gửi */}
          <Panel>
            <PanelTitle>
              <Send size={18} /> Gửi thông báo mới
            </PanelTitle>
            <form onSubmit={handleSendNotification}>
              <FormGroup>
                <FormLabel>Đối tượng nhận:</FormLabel>
                <RadioGroup>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="targetType"
                      value="broadcast"
                      checked={targetType === 'broadcast'}
                      onChange={() => setTargetType('broadcast')}
                    />
                    <span>Gửi toàn bộ (Broadcast)</span>
                  </RadioLabel>
                  <RadioLabel>
                    <input
                      type="radio"
                      name="targetType"
                      value="direct"
                      checked={targetType === 'direct'}
                      onChange={() => setTargetType('direct')}
                    />
                    <span>Gửi nhóm người dùng (Direct)</span>
                  </RadioLabel>
                </RadioGroup>
              </FormGroup>

              {targetType === 'direct' && (
                <FormGroup>
                  <FormLabel>Danh sách người nhận:</FormLabel>
                  <MultiSelectWrapper>
                    <SelectAllCheckbox>
                      <input
                        type="checkbox"
                        checked={selectedUserIds.length === users.length && users.length > 0}
                        onChange={handleSelectAll}
                      />
                      <span>Chọn tất cả ({users.length} người)</span>
                    </SelectAllCheckbox>
                    <UserCheckList>
                      {users.map(user => (
                        <UserCheckItem key={user.id} onClick={() => handleUserToggle(user.id)}>
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(user.id)}
                            readOnly
                          />
                          <span>{user.full_name || user.username} (@{user.username})</span>
                        </UserCheckItem>
                      ))}
                    </UserCheckList>
                  </MultiSelectWrapper>
                </FormGroup>
              )}

              <FormGroup>
                <FormLabel>Loại thông báo:</FormLabel>
                <select
                  style={{
                    padding: '10px 12px',
                    border: '1px solid rgba(185, 170, 150, 0.4)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#ffffff',
                    cursor: 'pointer'
                  }}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="GENERIC">Mặc định (Thông báo chung)</option>
                  <option value="ORDER_NEW">Đơn hàng mới</option>
                  <option value="SUPPORT_NEW">Yêu cầu hỗ trợ</option>
                  <option value="REVIEW_NEW">Đánh giá mới</option>
                </select>
              </FormGroup>

              <FormGroup>
                <FormLabel>Tiêu đề thông báo:</FormLabel>
                <FormInput
                  type="text"
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Nội dung chi tiết:</FormLabel>
                <FormTextarea
                  rows={4}
                  placeholder="Viết nội dung thông báo đầy đủ gửi đến người dùng..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={sending}>
                {sending ? 'Đang xử lý gửi...' : 'Phát Hành Thông Báo'}
              </SubmitButton>
            </form>
          </Panel>

          {/* Panel Lịch sử đã gửi */}
          <Panel>
            <PanelTitle>
              <Clock size={18} /> Lịch sử thông báo hệ thống
            </PanelTitle>
            {loading ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải lịch sử thông báo...</p>
            ) : notifications.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chưa có thông báo nào được phát hành.</p>
            ) : (
              <NotificationList>
                {notifications.map((notif) => (
                  <NotificationItem key={notif.id}>
                    <IconWrap $type={notif.type}>
                      {getIconFromType(notif.type)}
                    </IconWrap>
                    <NotifContent>
                      <NotifTitle>{notif.title}</NotifTitle>
                      <NotifMessage>{notif.message}</NotifMessage>
                      <NotifMeta>
                        <span>Loại: {notif.type_label}</span>
                        <span>•</span>
                        <span>{new Date(notif.send_date).toLocaleString('vi-VN')}</span>
                      </NotifMeta>
                    </NotifContent>
                  </NotificationItem>
                ))}
              </NotificationList>
            )}
          </Panel>
        </Grid>
      </Container>
    </>
  )
}

export default AdminNotificationsPage
