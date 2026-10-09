---
name: Isan Modern PropTech
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4947'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a63'
  primary: '#005c55'
  on-primary: '#ffffff'
  primary-container: '#0f766e'
  on-primary-container: '#a3faef'
  inverse-primary: '#80d5cb'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#004eaa'
  on-tertiary: '#ffffff'
  tertiary-container: '#0165d8'
  on-tertiary-container: '#e4eaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf2e8'
  primary-fixed-dim: '#80d5cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  primary-hover: '#115E59'
  primary-light: '#F0FDFA'
  status-available: '#10B981'
  status-reserved: '#F59E0B'
  status-sold: '#EF4444'
  danger-scam: '#DC2626'
  chart-views: '#3B82F6'
  chart-speed: '#F97316'
  surface-card: '#FFFFFF'
  canvas-background: '#F8FAFC'
  text-muted: '#64748B'
  border-subtle: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-lg-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 26px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm-medium:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 22px
  label-xs:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 18px
  price-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 30px
  price-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a trustworthy, modern, and accessible regional real estate platform tailored specifically for Thailand, anchored around the inaugural pilot in Udon Thani. The brand personality balances institutional credibility with local warmth: it must feel as safe and dependable as a primary commercial bank while remaining approachable, legible, and simple to navigate for buyers, sellers, and agents across all age demographics.

The aesthetic follows a refined Corporate Modern approach blended with crisp Soft Minimalist architecture. Key design characteristics include:
- **Calm Grounding**: A dominant cool canvas (#F8FAFC) paired with crisp white card containers (#FFFFFF), preventing screen glare and cognitive fatigue during intensive map and listing browsing.
- **Strict Brand Restraint (60-30-10 Rule)**: Forest Teal (#0F766E) serves solely as an intentional focal driver for critical CTAs and active states, never washing out backgrounds or diluting message clarity.
- **High Information Integrity**: Transparent status taxonomy (Available, Reserved, Sold) immediately communicates deal freshness and inventory honesty.
- **Bilingual & Thai-First Clarity**: Generous vertical line-heights and open letter tracking guarantee Thai glyphs (accents, tone marks) remain legible without vertical clipping.

## Colors

The color palette operates under a functional hierarchy engineered for transaction security, quick status scanning, and scannable marketplace feeds:

- **Primary (`#0F766E`)**: Forest Teal represents stability, verification, and grounded prestige. Used strictly for prime actions (primary buttons, active tab indicators, selected map pins, interactive highlights).
- **Secondary (`#10B981`)**: Emerald Green denotes verified properties and available status tags.
- **Tertiary (`#3B82F6`)**: Sky Blue powers informational metrics, analytical view graphs, and neutral insights.
- **Neutral (`#0F172A`)**: Deep Slate serves as the primary text color, delivering readable contrast against both pure white surfaces and soft canvas panels.

### Status & State Rules
- **Inventory States**: Available uses `#10B981` (เขียวว่าง), Reserved uses `#F59E0B` (ส้มติดจอง), and Sold uses `#EF4444` (แดงขายแล้ว).
- **Safety Warnings**: Destructive triggers, scam alarms, and KYC flags use `#DC2626`.
- **Exclusion**: Purple hues are completely forbidden across UI elements, tokens, and chart visualizations.

## Typography

Typography prioritizes legibility, price scanning, and clean bilingual composition (Thai and English). The primary system typeface is Plus Jakarta Sans paired seamlessly with Sarabun for native Thai script contexts.

### Design Principles
- **Extended Line Heights for Thai Script**: Due to tone marks (วรรณยุกต์) and upper/lower vowels (สระบน/สระล่าง), all body line-heights are granted an additional 4–6px buffer over standard Western baselines to avoid clipping.
- **Hierarchy for Financial Figures**: Monetary numbers (`฿1,450,000`) utilize bold tabular numerals (`price-xl` and `price-sm`) so pricing can be compared rapidly down a grid or over map pins.
- **Thai-First Labeling**: Navigation bars, form labels, and status badges prioritize localized vernacular (e.g., "สำรวจ", "บันทึก", "แชท", "ติดจอง") with sub-labels or descriptions rendered at `body-sm` (`14px`) in secondary slate (`#64748B`).

## Layout & Spacing

The layout is structured around an 8px base spacing grid (with 4px half-steps for micro-components such as badges and icon paddings).

### Form Factor Specifications
- **Desktop (1440 × 900)**: 12-column responsive fluid container with max-width boundaries of 1320px. 24px gutters (`gutter-desktop`) and 32px margins (`margin-desktop`). Fixed top app navigation bar with integrated search.
- **Tablet (834 × 1194)**: Split 50/50 dual viewport across vertical orientations—interactive leaflet map on one half, scannable property listing feed on the other half.
- **Mobile (390 × 844)**: Single-column vertical stream. Sticky bottom navigation bar with 4 primary destinations (สำรวจ / บันทึก / แชท / โปรไฟล์). Modals present natively as sliding bottom sheets with safe-area padding.

Content sections adhere to strict internal padding rules: property cards feature 12px or 16px internal padding, while section headings maintain a standard 24px bottom buffer.

## Elevation & Depth

Visual depth combines subtle border boundaries with ambient drop shadows, emphasizing light clean surfaces over dramatic drop-offs.

- **Flat Surface (Level 0)**: Applied to general page backgrounds (`#F8FAFC`). No shadow.
- **Card Baseline (Level 1)**: White surfaces (`#FFFFFF`) framed with a 1px border (`#E2E8F0`) and an ambient shadow: `0px 1px 3px rgba(15, 23, 42, 0.05)`.
- **Interactive Card Hover & Floating Elements (Level 2)**: Used for active hover states, map price pins, and search bars: `0px 4px 12px rgba(15, 23, 42, 0.08)`.
- **Modals & Overlays (Level 3)**: Centered desktop dialogs and mobile bottom sheets: `0px 16px 32px rgba(15, 23, 42, 0.14)`. Backdrop dimming utilizes `#0F172A` with a 40% alpha channel.

## Shapes

The design system standardizes on a friendly, approachable geometric curve:

- **Core Radius (`12px`)**: Used for all standard interactive surfaces, cards, input text containers, modal viewports, and primary buttons.
- **Compact Radius (`8px`)**: Reserved for micro-elements, status chips, thumbnail badges, and thumbnail image corners.
- **Pill Shape (`9999px`)**: Exclusively reserved for map price indicators, category filter chips, search input capsules, and verification indicators.

## Components

### Buttons
- **Primary**: Solid Forest Teal (`#0F766E`), hover state `#115E59`, active state `#0D5A54`. High-contrast white text, font weight 600, radius 12px. Padding: 12px vertical, 20px horizontal.
- **Secondary**: Crisp white container, 1px border (`#E2E8F0`), deep slate text (`#0F172A`). Hover state elevates to `#F8FAFC`.
- **Destructive**: Bordered or filled with `#DC2626` for irreversible actions (delete listing, report scam).

### Property Cards
- Aspect ratio 16:9 property photo container with 8px inner-radius or 12px flush corner.
- Status badge placed top-left (e.g., ขาย / เช่า / ติดจอง).
- Favorite action (Heart icon button) positioned top-right with semi-transparent frosted background (`rgba(255, 255, 255, 0.85)`).
- Card body features bold primary price (`#0F172A`, 20px), property headline, Thai location string, and a clean specs row separated by middle dots (ตร.ม. · นอน · น้ำ).

### Map Price Pins
- Standard Pin: White pill container with bold dark text (`#0F172A`), enclosed with a 1px `#E2E8F0` border and Level 2 ambient shadow.
- Selected / Focused Pin: Solid Forest Teal (`#0F766E`) pill container with crisp white text.

### Filter Chips
- Default state: White background, 1px `#E2E8F0` border, `#0F172A` text, 9999px pill radius.
- Active state: `#F0FDFA` (Forest Teal tint) background with a 1px `#0F766E` stroke and `#0F766E` font color.

### Form Inputs & Checkboxes
- Text Fields: White surface with 1px `#E2E8F0` border, 12px radius, `#0F172A` input text, and `#64748B` placeholder color. Focused state triggers a 1.5px `#0F766E` border with no harsh glow.
- Checkboxes & Radios: Forest Teal active fills with clean white check/radio marks; inactive borders rest in `#CBD5E1`.

### Status Badges
- **Available (ว่าง)**: Background `#ECFDF5`, text `#10B981`, dot indicator `#10B981`.
- **Reserved (ติดจอง)**: Background `#FFFBEB`, text `#F59E0B`, dot indicator `#F59E0B`.
- **Sold (ขายแล้ว)**: Background `#FEF2F2`, text `#EF4444`, dot indicator `#EF4444`.