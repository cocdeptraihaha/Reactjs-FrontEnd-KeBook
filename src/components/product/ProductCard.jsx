import { pickPrimaryImage } from '../../api/books'
import { Badge, Body, Card, Cover, CoverImg, Meta, Price, Rating, Title } from './ProductCard.styles'

function asNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function getFinalPrice(book) {
  return asNumber(book?.final_price ?? book?.selling_price ?? book?.price)
}

function getRating(book) {
  return book?.average_rating ?? book?.rating ?? book?.avg_rating
}

export function ProductCard({ book, badge, badgeTone }) {
  const image = pickPrimaryImage(book)
  const rating = getRating(book)

  return (
    <Card to={`/app/book/${book?.id || 1}`}>
      <Cover>
        {badge ? <Badge $tone={badgeTone}>{badge}</Badge> : null}
        {image ? <CoverImg src={image} alt={book?.title || 'Book cover'} /> : null}
      </Cover>
      <Body>
        <Title title={book?.title}>{book?.title || 'Untitled book'}</Title>
        <Meta>{book?.author || 'Unknown author'}</Meta>
        {rating != null ? (
          <Rating>Rating: {Number(rating).toFixed(1)}/5</Rating>
        ) : (
          <Rating>&nbsp;</Rating>
        )}
        <Price>{getFinalPrice(book).toLocaleString('vi-VN')} đ</Price>
      </Body>
    </Card>
  )
}
