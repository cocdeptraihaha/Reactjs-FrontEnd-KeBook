import { useState } from 'react'
import { Info } from 'react-feather'
import { pointsApi } from '../../api/points'
import { usersApi } from '../../api/users'
import { Section, SectionSub, SectionTitle } from '../../components/Section'
import { useAsync } from '../../hooks/useAsync'
import { formatPoint } from '../../utils/formatters'
import { Alert, BalanceCard, P, PrimaryCheckoutButton, RewardAction, RewardCard, RewardCost, RewardIconBox, RewardInfo, RewardList, RewardName, RewardNote, RewardsShell, RewardTag, RewardTop, SuccessText, Wrap } from '../WorkflowPages.styles'
import { getPointBalance, getRewardFallbackName, getRewardIcon, getRewardRemaining, getRewardTag } from './rewardUtils'

export function RewardsPage() {
  const rewards = useAsync(() => pointsApi.rewards(), [])
  const points = useAsync(() => usersApi.myPoints(), [])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [redeemingId, setRedeemingId] = useState(null)
  const balance = getPointBalance(points.data)

  async function redeem(reward) {
    const remaining = getRewardRemaining(reward)
    if (balance < Number(reward.cost_points || 0)) {
      setError('Bạn chưa đủ điểm để đổi voucher này')
      setSuccess('')
      return
    }
    if (remaining === 0) {
      setError('Voucher này đã hết lượt đổi')
      setSuccess('')
      return
    }

    try {
      setRedeemingId(reward.id)
      setError('')
      setSuccess('')
      const redeemed = await pointsApi.redeem(reward.id)
      setSuccess(`Đổi thành công: ${redeemed?.code || 'voucher mới'}`)
      await Promise.all([rewards.reload(), points.reload()])
    } catch (x) {
      setError(x.message || 'Redeem failed')
    } finally {
      setRedeemingId(null)
    }
  }

  return (
    <Wrap>
      <Section>
        <RewardsShell>
          <RewardTop>
            <div>
              <SectionTitle>Rewards - Đổi điểm</SectionTitle>
              <SectionSub>Đổi điểm thưởng của bạn lấy voucher hấp dẫn.</SectionSub>
            </div>
            <BalanceCard>
              <P>Điểm hiện có</P>
              <strong>{points.loading ? '...' : `${formatPoint(balance)} điểm`}</strong>
            </BalanceCard>
          </RewardTop>

          {error && <Alert role="alert">{error}</Alert>}
          {success && <SuccessText>{success}</SuccessText>}
          {rewards.loading && <P>Loading rewards...</P>}
          {rewards.error && <Alert role="alert">{rewards.error}</Alert>}
          {!rewards.loading && !rewards.error && (rewards.data || []).length === 0 && <P>No rewards available.</P>}

          <RewardList>
            {(rewards.data || []).map((reward) => {
              const Icon = getRewardIcon(reward)
              const remaining = getRewardRemaining(reward)
              const insufficient = balance < Number(reward.cost_points || 0)
              const soldOut = remaining === 0
              const disabled = insufficient || soldOut || redeemingId === reward.id
              return (
                <RewardCard key={reward.id}>
                  <RewardIconBox>
                    <Icon size={42} />
                  </RewardIconBox>
                  <RewardInfo>
                    <RewardName>{getRewardFallbackName(reward)}</RewardName>
                    <P>{reward.description || 'Voucher cá nhân dùng khi checkout.'}</P>
                    <RewardTag>{getRewardTag(reward)}</RewardTag>
                  </RewardInfo>
                  <RewardCost>
                    Điểm cần có
                    <strong>{formatPoint(reward.cost_points)} điểm</strong>
                  </RewardCost>
                  <RewardAction>
                    <PrimaryCheckoutButton type="button" onClick={() => redeem(reward)} disabled={disabled}>
                      {redeemingId === reward.id ? 'Đang đổi...' : 'Đổi ngay'}
                    </PrimaryCheckoutButton>
                    <P>
                      {remaining == null ? 'Còn lại: Không giới hạn' : `Còn lại: ${formatPoint(remaining)} lượt`}
                    </P>
                    {insufficient && <Alert>Không đủ điểm</Alert>}
                    {soldOut && <Alert>Hết lượt</Alert>}
                  </RewardAction>
                </RewardCard>
              )
            })}
          </RewardList>

          <RewardNote>
            <Info size={20} />
            <div>
              <strong>Lưu ý</strong>
              <P>Điểm thưởng không có giá trị quy đổi thành tiền mặt.</P>
              <P>Voucher sau khi đổi có hiệu lực theo điều kiện và thời hạn quy định.</P>
              <P>Mỗi loại voucher chỉ được đổi 1 lần/lượt tài khoản.</P>
            </div>
          </RewardNote>
        </RewardsShell>
      </Section>
    </Wrap>
  )
}
