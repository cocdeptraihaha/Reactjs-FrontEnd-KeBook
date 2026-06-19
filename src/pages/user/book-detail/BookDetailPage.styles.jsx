import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Section } from '../../../components/Section'

export const Wrap = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 1200px) {
    gap: 20px;
  }
`

export const Hero = styled(Section)`
  display: grid;
  gap: 14px;
  align-items: start;

  @media (min-width: 860px) {
    grid-template-columns: 250px minmax(0, 1fr);
    gap: 18px;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 310px minmax(0, 1fr);
    gap: 24px;
  }
`

export const Cover = styled.div`
  border-radius: var(--radius-md);
  min-height: 300px;
  background:
    linear-gradient(145deg, rgba(31, 77, 46, 0.14), rgba(164, 72, 97, 0.12)),
    #e9e3d8;
  border: 1px solid rgba(185, 170, 150, 0.78);
  overflow: hidden;
  box-shadow: var(--shadow-card);

  @media (min-width: 1280px) {
    min-height: 380px;
  }
`

export const CoverImg = styled.img`
  width: 100%;
  height: 100%;
  min-height: inherit;
  object-fit: cover;
  display: block;
`

export const Thumbs = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`

export const Thumb = styled.button`
  width: 62px;
  height: 78px;
  border-radius: 8px;
  border: 2px solid ${(p) => (p.$active ? 'var(--gold-600)' : 'rgba(0,0,0,0.08)')};
  background: #f3eee3;
  padding: 0;
  overflow: hidden;
`

export const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

export const BookTitle = styled.h3`
  margin-top: 8px;
  font-family: var(--font-display);
  font-size: 1.65rem;
  line-height: 1.08;

  @media (min-width: 760px) {
    font-size: 2rem;
  }
`

export const Meta = styled.p`
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 0.95rem;
`

export const PriceRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const CurrentPrice = styled.p`
  margin: 0;
  color: var(--brand-900);
  font-size: 1.6rem;
  font-weight: 800;
`

export const OriginalPrice = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 1rem;
  font-weight: 500;
  text-decoration: line-through;
`

export const DiscountBadge = styled.span`
  background-color: var(--accent-red, #e74c3c);
  color: white;
  padding: 2px 8px;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 4px;
`

export const StockBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  background-color: ${(p) => (p.$inStock ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)')};
  color: ${(p) => (p.$inStock ? '#27ae60' : '#c0392b')};
  margin-top: 8px;
  width: fit-content;
`

export const Actions = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`

export const PrimaryBtn = styled.button`
  border: 0;
  border-radius: var(--radius-pill);
  min-height: 46px;
  padding: 11px 17px;
  color: #fff;
  background: linear-gradient(140deg, var(--brand-950), var(--brand-700));
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(31, 77, 46, 0.18);
`

export const SecondaryBtn = styled(Link)`
  border-radius: var(--radius-pill);
  min-height: 46px;
  padding: 11px 17px;
  border: 1px solid rgba(30, 74, 42, 0.25);
  color: var(--brand-900);
  font-size: 0.9rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
`

export const StateText = styled.p`
  color: var(--text-secondary);
`

export const RetryButton = styled.button`
  border: 1px solid rgba(30, 74, 42, 0.2);
  border-radius: var(--radius-pill);
  min-height: 40px;
  padding: 8px 13px;
  background: #fff;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
`

export const ListCard = styled(Section)`
  min-width: 0;
  overflow: hidden;

  ul {
    margin: 8px 0 0;
    padding-left: 18px;
    display: grid;
    gap: 8px;
    color: var(--text-secondary);
  }
`

export const SimilarViewport = styled.div`
  margin-top: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
  padding-bottom: 8px;
  mask-image: linear-gradient(90deg, transparent 0, #000 18px, #000 calc(100% - 18px), transparent 100%);

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(84, 79, 69, 0.25);
    border-radius: 999px;
  }
`

export const SimilarGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(158px, 74vw);
  gap: 12px;

  > * {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  @media (min-width: 760px) {
    grid-auto-columns: 206px;
    gap: 14px;
  }

  @media (min-width: 1200px) {
    grid-auto-columns: 220px;
    gap: 16px;
  }
`

export const SpecsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 14px;
  font-size: 0.92rem;
  color: var(--text-secondary);
`

export const SpecsRow = styled.tr`
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }
`

export const SpecLabel = styled.td`
  padding: 10px 12px 10px 0;
  font-weight: 600;
  color: var(--text-muted, #7f8c8d);
  width: 35%;
  vertical-align: top;
`

export const SpecValue = styled.td`
  padding: 10px 0 10px 12px;
  color: var(--text-primary, #2c3e50);
  vertical-align: top;
`

export const DescriptionBox = styled.div`
  margin-top: 14px;
  line-height: 1.6;
  font-size: 0.95rem;
  color: var(--text-secondary);

  p {
    margin-bottom: 12px;
    white-space: pre-line;
  }
`

export const RatingSummaryContainer = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  @media (min-width: 640px) {
    grid-template-columns: 180px 1fr;
    align-items: center;
  }
`

export const AvgScoreBox = styled.div`
  text-align: center;
  background-color: #faf7f2;
  border-radius: var(--radius-md);
  padding: 20px;
  border: 1px solid rgba(185, 170, 150, 0.2);
`

export const AvgScore = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: var(--brand-900);
  line-height: 1;
  margin-bottom: 4px;
`

export const AvgStars = styled.div`
  color: #f1c40f;
  font-size: 1.15rem;
  letter-spacing: 2px;
  margin-bottom: 6px;
`

export const TotalReviewsCount = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
`

export const RatingBars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.88rem;
`

export const StarLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  color: var(--text-secondary);
  min-width: 48px;
`

export const ProgressBarContainer = styled.div`
  flex: 1;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
`

export const ProgressBar = styled.div`
  height: 100%;
  background-color: #f1c40f;
  border-radius: 4px;
  width: ${(p) => p.$percentage || 0}%;
  transition: width 0.4s ease;
`

export const PercentLabel = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted);
  min-width: 32px;
  text-align: right;
`

export const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const ReviewItem = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 16px;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`

export const ReviewHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
`

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--brand-900);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
`

export const ReviewMetaInfo = styled.div`
  flex: 1;
`

export const ReviewAuthor = styled.h5`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary, #2c3e50);
`

export const ReviewStars = styled.div`
  color: #f1c40f;
  font-size: 0.85rem;
  margin-top: 2px;
  letter-spacing: 1px;
`

export const ReviewDate = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted);
`

export const ReviewContent = styled.p`
  margin: 4px 0 0;
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.5;
  white-space: pre-wrap;
`

