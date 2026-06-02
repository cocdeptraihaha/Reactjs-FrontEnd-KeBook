
import {
  Item,
  Cover,
  Body,
  Head,
  H3,
  Meta,
  Stock,
  Row,
  QtyGroup,
  QtyBtn,
  QtyText,
  PriceBlock,
  UnitPrice,
  LinePrice,
  RemoveBtn,
} from './CartItem.styles'
const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

function formatVnd(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} đ`
}

export function CartItem({ item, onIncrease, onDecrease, onRemove, busy }) {
  const imageSrc = item?.image_url || PLACEHOLDER
  const qty = Number(item?.quantity || 0)
  const unitPrice = Number(item?.price || 0)
  const linePrice = unitPrice * qty
  const stock = Number(item?.stock_quantity || 0)

  return (
    <Item>
      <Cover src={imageSrc} alt={item?.title || 'Book'} />
      <Body>
        <Head>
          <H3>{item?.title || `Book #${item?.book_id || ''}`}</H3>
          <Meta>Book ID: {item?.book_id || '-'}</Meta>
          <Stock $low={stock <= qty}>Stock: {stock}</Stock>
        </Head>
        <Row>
          <QtyGroup>
            <QtyBtn type="button" onClick={() => onDecrease?.(item)} disabled={busy || qty <= 1}>-</QtyBtn>
            <QtyText>{qty}</QtyText>
            <QtyBtn type="button" onClick={() => onIncrease?.(item)} disabled={busy || (stock > 0 && qty >= stock)}>+</QtyBtn>
          </QtyGroup>
          <PriceBlock>
            <UnitPrice>{formatVnd(unitPrice)} / item</UnitPrice>
            <LinePrice>{formatVnd(linePrice)}</LinePrice>
          </PriceBlock>
        </Row>
        <RemoveBtn type="button" onClick={() => onRemove?.(item)} disabled={busy}>Remove</RemoveBtn>
      </Body>
    </Item>
  )
}
