 Let's read Fahasa source to extract design guidelines. Let's produce the Markdown design brief. No tools needed, just raw design brief based on HTML structure, inline styles, and CSS classes seen. Let's analyze.

Fahasa HTML structure analysis:
- Desktop top banner: `#ED2E29` height 60px (see `pace_1263x60.png` image dimension).
- Logo width: 220px desktop.
- Font stack seen in code: `Nunito Sans`.
- Grid/container: Swiper slide sizes, `block-item` class grid, desktop-only layout, mobile-only styles (`fhs_header_desktop` vs `fhs_header_mobile`).
- Flash Sale slider: uses red label, Nunito Sans font, grid with block item width around 270px.
- Category block: Grid with 10 columns (`grid-template-columns: repeat(10, 1fr)`), margin-top 16px, font-size 1.23em.
- Brands slider: `slidesPerView: 9`.
- Color tokens:
  - Main brand red: `#C92127` / `#ED2E29`
  - Text gray: `#7A7E7F` / `#0D0E0F` (dark) / `#333333`
  - Category pink background: `#FCDDEF`
  - Accent blue: `#2489f4` / `#2489F4`
  - Border/line gray: `#F2F4F5` / `#cecece`
- Product cards: item width 270px, final price 2em, font size 1.23em, discount percent, name, author, description.
- Cover ratios: `swiper-slide` banner ratio 840x320 (~2.6:1), sub-banners momo/zalopay 392x156 (~2.5:1), icons 120x120 (1:1), brand logos 115x115 (1:1). Product collection covers typically 3D/2D vertical rectangles (standard Vietnamese book ratio is ~1:1.4 to 1:1.5, e.g., 14x20.5cm).

Let's organize the brief strictly into the requested sections:
1. Overall layout density
2. Nav/header size
3. Product card proportions
4. Book cover ratio
5. Typography scale
6. Spacing
7. Buttons
8. Sliders/carousels
9. Concrete component sizes to copy in React styled-components

Keep it terse, fast, highly actionable. Only Markdown. No chatter outside Markdown. No pleasantries. No intro/outro. Only raw brief.# Bookstore UI Design Brief: Fahasa-Inspired Specs

## 1. Overall Layout Density
* **Layout Grid**: 12-column desktop grid with fixed container max-width: `1200px` (standard container matches `1100px` to `1200px` viewport limits).
* **Responsive Breakpoints**:
  * Desktop: `screen and (min-width: 993px)`
  * Tablet/Mobile Transition: `screen and (max-width: 992px)`
  * Mobile: `screen and (max-width: 768px)`
  * Small Mobile: `screen and (max-width: 650px)`
* **Density Strategy**: High density, content-packed retail style. Grid templates transition from 8-10 items per row on desktop to horizontal swipe-carousels on mobile to avoid vertical scroll bloat.

## 2. Nav / Header Size
* **Top Promo Banner**: `60px` height. Background: `#ED2E29`.
* **Desktop Main Header Height**: `84px` total height. Flex center layout.
  * **Logo Width**: `220px` (desktop), `auto` (mobile max-height `35px`).
  * **Search Bar**: `width: calc(100% - 450px)`, max-width `600px`, height `40px` with rounded borders (`border-radius: 8px`).
* **Header Icon Elements**: `48px` x `48px` clickable zones for Cart, Notifications, and Account.
* **Mobile Sticky Header**: `holded` state active after scroll offset `>= 28px` to compress height to `54px`.

## 3. Product Card Proportions
* **Desktop Grid Card Width**: Base `210px` to `270px` depending on column span (4 to 5 cards per container width).
* **Card Internal Layout**: Vertical stack with fixed margins.
  * Cover wrapper height: `190px` to `240px` (enforces uniform grid baseline).
  * Text content: Two-line title limit (`line-clamp: 2`).
  * Price block: Main price prominent, old price + discount tag side-by-side.
* **Border Radius**: Card outer `8px` (`border_radius_normal`), thumbnail image `4px` (`border_radius_small`).

## 4. Book Cover Ratio
* **Book Cover Aspect Ratio**: Strict `1:1.4` to `1:1.45` ratio (standard Vietnamese publisher standard `14cm x 20.5cm`).
* **Banner Cover Ratio**:
  * Desktop Main Slider: `840px` x `320px` (Ratio `2.6:1`).
  * Sub-Banners (e.g. Zalopay/Momo blocks): `392px` x `156px` (Ratio `2.5:1`).
* **Logo / Brand Icons Aspect Ratio**: Strict `1:1` square (`115px` x `115px` or `120px` x `120px`).

## 5. Typography Scale
* **Base Font Family**: `'Nunito Sans', sans-serif`.
* **Scale Tokens**:
  * **Hero Price**: `2.0em` (`32px`) - High contrast red color (`#C92127`).
  * **Section/Tab Titles**: `1.7em` (`24px` to `27px`) - Bold, gray (`#7A7E7F`) or red on active state.
  * **Card Book Title**: `1.23em` (`18px` to `20px`) - Medium weight, dark color (`#0D0E0F`).
  * **Card Author/Publisher text**: `1.1em` (`14px` to `16px`) - Regular weight, muted gray.
  * **Muted/Helper labels**: `13px` / `0.85em` - Regular weight.

## 6. Spacing
* **Page-Level Margins**: `24px` horizontal padding on desktop, `12px` on tablet, `8px` on mobile.
* **Component-Level Gaps**:
  * Standard section spacing: `24px` margin-top/bottom.
  * Grid gap: `8px` to `10px` (compact spacing rules to maximize screen space).
  * Vertical list text margin: `8px` to `16px`.

## 7. Buttons
* **Primary / Buy Action Button**: Rounded-corner rectangles (`border-radius: 8px`). Height: `44px` (desktop), `36px` (mobile). Bold, uppercase text.
* **Buy/Add to Cart Button Style**: Active fill red (`#C92127`) or outline red with transition scaling (`transform: scale(1.03)` on hover).
* **Dropdown / Drop-menu item Triggers**: Target padding `8px 12px`, subtle border bottom separator (`1px solid #F2F4F5`).

## 8. Sliders / Carousels
* **Layout Design**: Swiper-based responsive sliders.
* **Control Elements**:
  * Hover-to-reveal navigation arrows (`position: absolute`, `top: 50%`, `transform: translateY(-50%)`, width/height `40px` circular).
  * Slider item overflow: `overflow: hidden` on container, slides set to `width: auto` to allow partial next-item reveal (prompts mobile swipe).

## 9. React styled-components Code to Copy

```javascript
import styled from 'styled-components';

// Color Palette
export const colors = {
  brandRed: '#C92127',
  brandRedLight: '#ED2E29',
  bgPink: '#FCDDEF',
  textDark: '#0D0E0F',
  textMuted: '#7A7E7F',
  textClassic: '#333333',
  linkBlue: '#2489F4',
  borderLight: '#F2F4F5',
  borderGray: '#CECECE',
  white: '#FFFFFF',
};

// Main Container
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  padding-right: 24px;
  padding-left: 24px;
  box-sizing: border-box;

  @media (max-width: 992px) {
    padding-right: 12px;
    padding-left: 12px;
  }
  @media (max-width: 768px) {
    padding-right: 8px;
    padding-left: 8px;
  }
`;

// Desktop Navigation Bar Wrapper
export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 84px;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.borderLight};
`;

// Search Bar Input Field
export const SearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  height: 40px;
  padding: 8px 16px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  color: ${colors.textDark};
  background-color: ${colors.white};
  border: 2px solid ${colors.brandRed};
  border-radius: 8px;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: ${colors.textMuted};
  }
`;

// Standard Book Cover Image Wrapper
export const BookCoverWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1.43; /* Ideal Vietnamese book cover ratio */
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background-color: ${colors.borderLight};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

// Product Card
export const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  background-color: ${colors.white};
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid transparent;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: ${colors.borderLight};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

// Card Title (Truncated to max 2 lines)
export const CardTitle = styled.h4`
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1.23em;
  font-weight: 600;
  color: ${colors.textDark};
  margin: 12px 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.8em; /* Lock height to prevent grid jitter */
`;

// Pricing Container Block
export const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

export const MainPrice = styled.span`
  font-family: 'Nunito Sans', sans-serif;
  font-size: 2.0em;
  font-weight: 700;
  color: ${colors.brandRed};
  line-height: 1.1;
`;

export const DiscountGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

export const OldPrice = styled.span`
  font-size: 13px;
  text-decoration: line-through;
  color: ${colors.textMuted};
`;

export const DiscountTag = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.white};
  background-color: ${colors.brandRed};
  padding: 2px 6px;
  border-radius: 4px;
`;

// Tab Slider Header Style
export const TabHeaderList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 2px solid ${colors.borderLight};
  overflow-x: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for mobile swipe aesthetic */
  }
`;

export const TabHeaderItem = styled.li`
  padding: 12px 24px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1.1em;
  font-weight: 700;
  color: ${(props) => (props.active ? colors.brandRed : colors.textClassic)};
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${colors.brandRed};
    transform: scaleX(${(props) => (props.active ? 1 : 0)});
    transition: transform 0.2s ease;
  }

  &:hover {
    color: ${colors.brandRed};
  }
`;

// Horizontal Brand Round Circle Slider Item
export const BrandCircleItem = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 115px;
  text-decoration: none;

  img {
    width: 115px;
    height: 115px;
    border-radius: 50%;
    border: 1px solid ${colors.borderLight};
    object-fit: contain;
    background-color: ${colors.white};
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
`;

// Primary CTA Button
export const ButtonPrimary = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  padding: 0 24px;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  color: ${colors.brandRed};
  background-color: ${colors.white};
  border: 2px solid ${colors.brandRed};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    color: ${colors.white};
    background-color: ${colors.brandRed};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(201, 33, 39, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```
