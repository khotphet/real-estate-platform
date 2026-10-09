# MapNest — Comprehensive End-to-End (E2E) Test Specification
**Target System:** MapNest Real Estate Ecosystem (Udon Thani Pilot)  
**Specification Version:** 1.0 (53 Screens Coverage S01–S53)  
**Test Engine:** Playwright / Chromium Automated Headless Runner  
**Author:** Antigravity AI Pair Programmer

---

## 1. Overview & Strategy
This specification defines the complete end-to-end verification suite across all 4 system roles and 9 functional domains. Every test case models real user behavior, validating UI rendering, client-side state transitions, calculations, form submissions, and error handling.

### Roles Tested:
1. **Buyer / Tenant (ผู้ซื้อ/ผู้เช่า):** คุณวิชัย รัตนประเสริฐ (`089-123-4567`)
2. **Property Owner (เจ้าของทรัพย์):** คุณสมชาย ยิ่งเจริญ (`081-111-2222`)
3. **Agent Pro (นายหน้ามืออาชีพ):** คุณสมหญิง บุญรักษา (`081-882-9901`)
4. **Admin Ops (ผู้ดูแลระบบ):** แอดมินอุดรธานี (`080-999-0000`)
5. **Guest / Anonymous:** ผู้เยี่ยมชมทั่วไปยังไม่เข้าสู่ระบบ

---

## 2. Test Suites & Test Cases Matrix

### Suite 01: Authentication, Roles & Profile (S01 – S05)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-AUTH-01` | OTP Login Valid | Guest | Phone: `089-123-4567`, OTP: `123456` | Logs in successfully, sets session, Navbar displays user name & role badge | P0 |
| `TC-AUTH-02` | Quick Role Switch | Any | Click Role switcher in profile menu | Session updates immediately without page reload, Navbar updates role context | P0 |
| `TC-AUTH-03` | User Profile & KYC Level Check | Agent | Navigate to `/account` | Displays KYC Level 3 badge, TREBA license details, and contact information | P1 |

### Suite 02: Spatial Map Search & Discovery (S06 – S09, S17 – S18)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-MAP-01` | Map & Price Pins Load | Guest / Buyer | Navigate to `/` | Leaflet map renders with 12 price pin markers without console errors | P0 |
| `TC-MAP-02` | Property Type & Price Filtering | Buyer | Select Condo, Price range 1M - 3M | Map pins & list update to show only matching condos within price range | P0 |
| `TC-MAP-03` | Landmark Proximity Filter | Buyer | Select "UD Town" or "หนองประจักษ์" | Radius filter displays properties located within specified distance | P1 |
| `TC-MAP-04` | View Mode Switcher | Buyer | Toggle List View <-> Split View | Smooth transition without filter reset or page reload | P2 |

### Suite 03: Property Details & Buyer Decision (S10 – S14, S20)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-PROP-01` | Property Detail Rendering | Buyer | Navigate to `/listing/UD-00101` | Displays title, 14 images, specs grid, verified badge, poster details | P0 |
| `TC-PROP-02` | Mortgage PMT Calculator | Buyer | Slide Down Payment 20%, Term 30y | Monthly PMT calculation updates dynamically matching Thai bank PMT formula | P0 |
| `TC-PROP-03` | 4-Slot Property Comparison | Buyer | Navigate to `/compare` | Side-by-side comparison matrix loaded supporting up to 4 properties | P1 |
| `TC-PROP-04` | Favorites & Saved Items | Buyer | Click heart icon on listing | Listing appears in `/saved` under "ทรัพย์ที่บันทึกไว้" tab | P1 |
| `TC-PROP-05` | Report Listing Modal | Buyer | Click "แจ้งรายงานทรัพย์นี้" | Report modal opens with reason radios, submits confirmation feedback | P1 |

### Suite 04: Fair Play Waitlist & Anti-Snipe Queue (S10, S38 – S39)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-WAIT-01` | Reserved Property Status | Buyer | Navigate to `/listing/UD-00103` | Displays orange badge "ติดจอง (Reserved)" and "ต่อคิวทรัพย์ติดจอง" button | P0 |
| `TC-WAIT-02` | Join Waitlist Modal Auto-fill | Buyer | Click "ต่อคิวทรัพย์ติดจอง (Join Waitlist)" | Modal auto-fills Buyer's name & phone, shows Queue #2 and rule explanation | P0 |
| `TC-WAIT-03` | View & Manage Waitlist in Saved | Buyer | Navigate to `/saved` -> Tab "คิวจองสำรอง" | Displays queue item, expiry countdown, and "ยกเลิกคิว" button | P1 |

### Suite 05: Direct Chat & Viewing Appointments (S15, S16, S19)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-COMM-01` | Contextual Chat Initiation | Buyer | Click "แชทสอบถาม" from listing | Opens `/messages` with target listing pinned and pre-filled greeting | P0 |
| `TC-COMM-02` | Send Message & Timeline | Buyer | Type text and click send | New message appears in chat thread with timestamp | P1 |
| `TC-COMM-03` | Viewing Appointment Booking | Buyer | Click "นัดหมายเข้าชม" on listing | Modal opens with auto-filled info, date/time pickers, and submits | P0 |
| `TC-COMM-04` | Appointments Schedule Board | Buyer / Owner | Navigate to `/appointments` | Lists upcoming visits with host info, location, and status badges | P1 |

### Suite 06: Owner Property Posting & Speed-Sell (S21 – S32)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-POST-01` | 5-Step Posting Wizard Flow | Owner | Step through steps 1 to 5 | Seamless step transitions with spec inputs and price/sqm calculation | P0 |
| `TC-POST-02` | Duplicate Listing Detection | Owner | Step 5 in posting wizard | Displays duplicate check warning alert preventing duplicate spam | P0 |
| `TC-POST-03` | Owner Listings Management | Owner | Navigate to `/my-listings` | Displays owner's listings, KPI views/chats, and inline status switcher | P0 |
| `TC-POST-04` | Boost Packages & PromptPay QR | Owner | Navigate to `/packages`, buy Spotlight | Displays PromptPay QR modal with ฿499 and timer | P0 |

### Suite 07: Agent Pro & B2B Co-Broking Network (S33 – S37)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-COB-01` | Co-Broker Hub Catalog | Agent Pro | Navigate to `/agent-hub` | Displays co-broking listings with 50/50 commission breakdown | P0 |
| `TC-COB-02` | Digital Co-Broker Contract MOU | Agent Pro | Click "ขอร่วม Co-Broker", sign | Digital contract modal opens, allows signing, confirms agreement | P0 |
| `TC-COB-03` | Public Agent Microsite | Any | Navigate to `/agent/somying` | Shows Gold Verified rating (4.9★), closed deals (42), TREBA license | P1 |

### Suite 08: Reverse Marketplace / Demand Board (S40 – S44)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-DEM-01` | Create Spatial Demand Pin | Buyer | Navigate to `/demand/create`, submit | Generates demand pin (e.g. DM-UD-806) with budget & zone | P0 |
| `TC-DEM-02` | Browse Demand Board | Agent / Owner | Navigate to `/demands` | Shows buyer demand pins, budgets, urgency, and masked contact numbers | P1 |
| `TC-DEM-03` | Send Property Offer to Demand | Agent Pro | Click "ยื่นข้อเสนอทรัพย์", submit | Sends tailored property proposal directly into buyer's chat inbox | P0 |

### Suite 09: Admin Ops, Moderation & Trust Portal (S45 – S53)
| ID | Title | Role | Input / Preconditions | Expected Result | Priority |
|---|---|:---:|---|---|:---:|
| `TC-ADM-01` | Admin Dashboard & KPI Cards | Admin | Navigate to `/admin` | Displays platform operations status, KYC count, and healthy indicators | P0 |
| `TC-ADM-02` | KYC Queue Review & Approval | Admin | Click "อนุมัติ KYC" on pending item | Approves submission, updates status to Verified immediately | P0 |
| `TC-ADM-03` | Listing Moderation Queue | Admin | Click "อนุมัติเผยแพร่" on listing | Listing approved for public map publishing | P0 |
| `TC-ADM-04` | Scam & Defect Reports Resolution | Admin | Click "ตรวจสอบแล้ว" on report | Marks ticket resolved, archiving reported discrepancy | P1 |
| `TC-ADM-05` | Stale Listing Cleanup (Rule O9) | Admin | Check Rule O9 Metric in dashboard | Confirms 90-day stale listing cleanup monitor active | P2 |
