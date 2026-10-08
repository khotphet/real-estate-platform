---
name: MapNest Design System
version: 3.0.0
description: Real estate marketplace for Thailand (pilot Udon Thani). 52 screens (S01-S52) in 7 modules.
colors:
  primary: "#0F766E"          # Forest Teal - brand, primary buttons, active states ONLY
  primary-hover: "#115E59"
  primary-light: "#F0FDFA"    # active chip background
  active: "#10B981"           # Available / Verified badge
  reserved: "#F59E0B"         # Reserved (ติดจอง) badge
  sold: "#EF4444"             # Sold badge
  danger: "#DC2626"           # Scam warning, destructive actions
  chart-views: "#3B82F6"      # Views metric
  chart-speed: "#F97316"      # Speed-sell metric
  background: "#F8FAFC"
  surface: "#FFFFFF"
  text-primary: "#0F172A"
  text-secondary: "#64748B"
  border: "#E2E8F0"
typography:
  family: "Plus Jakarta Sans, Sarabun, sans-serif"
  sizes: { xs: 12px, sm: 14px, base: 16px, lg: 18px, xl: 20px, 2xl: 24px, 3xl: 30px }
radius: { sm: 8px, md: 12px, lg: 16px, pill: 9999px }
platforms:
  desktop: "1440 x 900, top navigation bar, 12-column grid"
  mobile: "390 x 844, bottom tab bar (สำรวจ / บันทึก / แชท / โปรไฟล์)"
  tablet: "834 x 1194, split view (map 50% + list 50%)"
---

# MapNest Design System

## 1. Overview
Friendly, trustworthy, easy for every age group. Clean white cards on a soft slate background. Thai-first labels.

## 2. Color Rules
- 60% white/slate background, 30% dark text and borders, 10% Forest Teal.
- Forest Teal (#0F766E) is used ONLY for the logo, primary buttons and active states. Never fill large areas with green.
- Status badges always use their own color: Available = #10B981, Reserved (ติดจอง) = #F59E0B, Sold = #EF4444.
- Charts: Views = #3B82F6, Speed-sell = #F97316, Success = #10B981.
- Do NOT use purple anywhere.

## 3. Platform Rule
- Generate ONE platform per request. Never mix desktop and mobile frames in the same request.
- Desktop = 1440px wide landscape. Mobile = 390px portrait. Tablet = 834px portrait.
- Modals (popups) are shown centered over a dimmed page on desktop, and as a bottom sheet on mobile.

## 4. Frame Naming Rule (CRITICAL)
Every frame title must be exactly: `<CODE> <Screen Name> [<Platform>]`
- Desktop: `S06 Map View [Desktop]`
- Mobile: `S06 Map View [Mobile]`
- Tablet: `S06 Map View [Tablet]`
Never use prompt text or "Generating Screen..." as a frame title.

## 5. Key Components
- Price pin on map: white pill, bold dark price, soft shadow. Selected pin = Forest Teal fill + white text.
- Property card: 16:9 photo, badge top-left (ขาย / เช่า / ติดจอง), heart top-right, big price, title, location, specs row (ตร.ม. · นอน · น้ำ), Verified badge.
- Primary button: Forest Teal fill, white bold text, radius 12px.
- Secondary button: white, 1px #E2E8F0 border, dark text.
- Filter chip: pill, white; active = #F0FDFA background + Forest Teal text.
- View switcher (like Agoda): segmented pill with 3 options `รายการ | รูปภาพ | แผนที่` (icons: list, image, map pin). Selected option = Forest Teal fill + white text.
  - Desktop: placed top-right of the results header on S06 and S08.
  - Mobile: search results hide the bottom tab bar, show a back button, and the switcher floats at the bottom center.
- Map pin (Agoda style): white pill with small round property thumbnail + price. Reserved = amber label "ติดจอง". Map shows a horizontal swipe carousel of property cards at the bottom, synced with the selected pin.

## 6. Mock Data — use ONLY these 12 listings on every screen
| # | Name | Type | Deal & Price | Size / Rooms | Location | Status |
|---|---|---|---|---|---|---|
| 1 | ลุมพินี เพลส ยูดี-โพศรี | Condo | ขาย ฿1,450,000 | 28.5 ตร.ม. · 1 นอน 1 น้ำ · ชั้น 8 | ถ.โพศรี | Available |
| 2 | เดอะ เบส เซ็นทรัล อุดร | Condo | เช่า ฿8,500/เดือน | 31 ตร.ม. · 1 นอน 1 น้ำ | ถ.วัฒนานุวงศ์ | Available |
| 3 | ศุภาลัย เบลล่า | House | ขาย ฿3,890,000 | 160 ตร.ม. · 3 นอน 2 น้ำ | ถ.มิตรภาพ | Reserved (ติดจอง) |
| 4 | ที่ดิน ซอยจินตคาม | Land | ขาย ฿2,400,000 | 120 ตร.ว. | อ.เมือง | Available |
| 5 | ทาวน์โฮม 2 ชั้น ถ.นิตโย | Townhome | ขาย ฿1,890,000 | 120 ตร.ม. · 3 นอน 2 น้ำ | ถ.นิตโย | Available |
| 6 | บ้านเดี่ยว ใกล้ UD Town | House | เช่า ฿15,000/เดือน | 140 ตร.ม. · 3 นอน 2 น้ำ | ถ.ทองใหญ่ | Available |
| 7 | คอนโด ใกล้หนองประจักษ์ | Condo | ขาย ฿1,190,000 | 26 ตร.ม. · สตูดิโอ | ถ.ทหาร | Sold (ขายแล้ว) |
| 8 | ทาวน์โฮม 3 ชั้น ถ.ประจักษ์ศิลปาคม | Townhome | เช่า ฿12,000/เดือน | 150 ตร.ม. · 3 นอน 3 น้ำ | ถ.ประจักษ์ศิลปาคม | Available |
| 9 | ที่ดินเปล่า บ้านเลื่อม | Land | ขาย ฿850,000 | 100 ตร.ว. | ต.บ้านเลื่อม | Available |
| 10 | บ้านเดี่ยว หนองสำโรง | House | ขาย ฿2,650,000 | 130 ตร.ม. · 3 นอน 2 น้ำ | ต.หนองสำโรง | Reserved (ติดจอง) |
| 11 | คอนโด ใกล้ ม.ราชภัฏอุดรธานี | Condo | เช่า ฿5,500/เดือน | 25 ตร.ม. · สตูดิโอ | ถ.ทหาร | Available |
| 12 | บ้านเดี่ยว ใกล้สนามบินอุดร | House | ขาย ฿4,290,000 | 200 ตร.ม. · 4 นอน 3 น้ำ | ถ.อุดรดุษฎี | Available |

Data rules:
- Search results (S06 map, S08 list/photo) show 11 listings: everything except #7. Sold listings leave search results.
- Result text: "พบ 11 ทรัพย์ในอุดรธานี". Chips: คอนโด (3) · บ้านเดี่ยว (4) · ทาวน์โฮม (2) · ที่ดิน (2). Sale 7 · Rent 4.
- Sold #7 appears only in S12 Saved (greyed, red "ขายแล้ว" badge) and S21 My Listings → Sold tab.
- Pin price format: ฿1.45M / ฿850K for sale, ฿8,500/ด. for rent. Cards show the full price.
- The same listing keeps the same photo, name and price on every screen (S06, S08, S09, S12, S16, S21).
- Never invent other listings, never show "48 รายการ".
City: Udon Thani (landmarks: Central Udon, UD Town, Nong Prajak Park, Udon Thani Airport).

## 7. Screen List (52)
**M1 Account:** S01 Login (modal) · S02 OTP Verification · S03 Role Selection · S04 Account & Settings · S05 Notifications
**M2 Search:** S06 Map View · S07 Filter (modal) · S08 List View (2 modes: รายการ / รูปภาพ) · S09 Property Detail · S10 Loan Calculator (modal) · S11 Compare · S12 Saved & Waitlist · S13 Post Demand Pin · S14 My Demands
**M3 Chat:** S15 Chat Inbox · S16 Chat Room · S17 Request Phone (modal) · S18 Book Viewing (modal) · S19 My Appointments · S20 Report / Block (modal)
**M4 Owner:** S21 My Listings · S22 Post 1/5 Type · S23 Post 2/5 Location · S24 Post 3/5 Price & Specs · S25 Post 4/5 Photos · S26 Post 5/5 Review · S27 Duplicate Found (modal) · S28 Manage Listing · S29 Change Status (modal) · S30 Listing Analytics
**M5 Agent:** S31 KYC Upload · S32 KYC Status · S33 Agent Hub · S34 Hub Property · S35 Demand Board · S36 Send Offer · S37 Agent Dashboard · S38 Agent Microsite
**M6 Payment:** S39 Packages · S40 Cart · S41 PromptPay QR · S42 Payment Success · S43 Payment Timeout · S44 Orders & Receipts
**M7 Admin (desktop only):** S45 Admin Dashboard · S46 KYC Queue · S47 Listing Review · S48 Reports & Scam · S49 Stale Listings · S50 Packages & Promo · S51 Orders & Refunds · S52 User Management
