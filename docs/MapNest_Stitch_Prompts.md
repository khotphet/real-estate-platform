# MapNest — คำสั่ง Stitch ทีละ Module

## วิธีใช้
1. Stitch ➜ **Blank project** ➜ เลือก **Web**
2. ในคำสั่งแรก ให้กด `+` แล้วแนบ 2 ไฟล์: `DESIGN.md` + `MapNest_UI_Combined.png`
3. ก๊อปคำสั่งทีละช่องด้านล่าง ➜ ส่ง ➜ **รอให้เสร็จ** ➜ ค่อยส่งช่องถัดไป
4. ถ้ารอบไหนออกมาเละ: กด `Cmd+Z` แล้วส่งคำสั่งเดิมซ้ำอีกครั้ง

> รอบที่ 1 ทำ **Desktop** ให้ครบทุก Module ก่อน แล้วรอบที่ 2 ค่อยทำ **Mobile** (และ Tablet ถ้าต้องการ)

---

## รอบที่ 1 · Desktop (โหมด Web)

### 1/11 · M1 บัญชี (S01–S05)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 1 Account, 5 screens:
- "S01 Login [Desktop]": centered modal over a dimmed homepage. Buttons: Continue with LINE, Continue with Google, phone number field (+66), PDPA consent checkbox, primary button "ขอรหัส OTP".
- "S02 OTP Verification [Desktop]": 6-digit code boxes, 60s countdown, "ขอรหัสใหม่" link.
- "S03 Role Selection [Desktop]": 3 large selectable cards: ผู้ซื้อ/ผู้เช่า, เจ้าของทรัพย์, นายหน้า.
- "S04 Account & Settings [Desktop]": profile photo, name, phone, role, language TH/EN, notification toggles, PDPA consent, logout.
- "S05 Notifications [Desktop]": list grouped by Today/Earlier: matching property, new message, viewing reminder, reserved unit released, KYC result.
Name every frame exactly as written in quotes.
```

### 2/11 · M2 ค้นหา ตอนที่ 1 (S06–S10)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 2 Search part 1, 6 screens, using the 12 mock listings in DESIGN.md (search shows 11, sold #7 hidden):
- "S06 Map View [Desktop]": full map of Udon Thani, Agoda-style pins (white pill with small round photo + price: ฿1.45M, ฿8,500/ด., ฿3.89M ติดจอง, ฿2.4M), top search bar + filter chips, 3-option view switcher รายการ | รูปภาพ | แผนที่ (แผนที่ selected), horizontal card carousel at the bottom synced with the selected pin, banner "ไม่เจอที่ถูกใจ? ปักหมุดความต้องการ".
- "S07 Filter [Desktop]": modal: Buy/Rent, property type, price range slider, bedrooms, size, Verified only, button "แสดง 11 รายการ".
- "S08 List View [Desktop]": same search bar and chips, same view switcher (รายการ selected), result count "พบ 11 ทรัพย์ในอุดรธานี", sort dropdown, 3-column property card grid.
- "S08 Photo View [Desktop]": same header and switcher (รูปภาพ selected). Large photo-first cards, one property per row, big gallery image with price and status badge overlaid.
- "S09 Property Detail [Desktop]": photo gallery, price, specs, description, small map, owner card with Verified badge, buttons "แชทกับเจ้าของ" and "นัดชม", heart and share.
- "S10 Loan Calculator [Desktop]": modal: down payment, interest rate, years, monthly payment result, button "ขอสินเชื่อกับธนาคาร".
Name every frame exactly as written in quotes.
```

### 3/11 · M2 ค้นหา ตอนที่ 2 (S11–S14)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 2 Search part 2, 4 screens:
- "S11 Compare [Desktop]": table comparing 3 properties side by side: price, price per sqm, size, bedrooms, location, status.
- "S12 Saved & Waitlist [Desktop]": two tabs: ❤️ ที่บันทึก and 🔔 รอคิว. Waitlist shows Supalai Bella with amber "ติดจอง" badge and "แจ้งเตือนเมื่อหลุดจอง".
- "S13 Post Demand Pin [Desktop]": map with a draggable pin and radius circle (0.5–5 km), budget, property type, buy/rent, note that exact location is hidden, VIP upsell 59 บาท.
- "S14 My Demands [Desktop]": list of my demands with status (เปิด / จับคู่แล้ว / ปิด), matched properties with match score, offers from agents.
Name every frame exactly as written in quotes.
```

### 4/11 · M3 แชท & นัดชม (S15–S20)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 3 Chat, 6 screens:
- "S15 Chat Inbox [Desktop]": left list of conversations grouped by property with unread badges, right side empty state.
- "S16 Chat Room [Desktop]": split view. Top pinned property card (Lumpini ฿1.45M, Available). Messages, red scam warning bar example, buttons "ขอเบอร์", "นัดชม", "รายงาน".
- "S17 Request Phone [Desktop]": modal asking the other side to share phone number, Allow / Decline.
- "S18 Book Viewing [Desktop]": modal with date picker and time slots, status Pending.
- "S19 My Appointments [Desktop]": upcoming and past viewings, reschedule, cancel, navigate, rate after viewing.
- "S20 Report / Block [Desktop]": modal with reasons (scam, fake listing, rude), attach screenshot, block user toggle.
Name every frame exactly as written in quotes.
```

### 5/11 · M4 เจ้าของ ตอนที่ 1 (S21–S25)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 4 Owner part 1, 5 screens:
- "S21 My Listings [Desktop]": tabs Draft / Published / Reserved / Sold / Archived, quota counter, button "+ ลงประกาศ", listing rows with status badges.
- "S22 Post 1/5 Type [Desktop]": stepper 1-5 at top. Sale or Rent, property type, sell myself or send to Agent Hub (Open / Exclusive).
- "S23 Post 2/5 Location [Desktop]": map pin picker, project name, building, floor, unit number.
- "S24 Post 3/5 Price & Specs [Desktop]": price, size, bedrooms, bathrooms, highlights, Thai/English description.
- "S25 Post 4/5 Photos [Desktop]": drag-and-drop upload, minimum 3 photos, reorder, choose cover photo.
Name every frame exactly as written in quotes.
```

### 6/11 · M4 เจ้าของ ตอนที่ 2 (S26–S30)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 4 Owner part 2, 5 screens:
- "S26 Post 5/5 Review [Desktop]": stepper at step 5, preview of the property card and detail page, button "เผยแพร่".
- "S27 Duplicate Found [Desktop]": modal: this unit already exists, options "แก้ไขประกาศเดิม" or "รวมเป็นยูนิตเดียว".
- "S28 Manage Listing [Desktop]": listing summary, buttons Edit, Create PDF, Share, Bump, Relist, Change status.
- "S29 Change Status [Desktop]": modal: Reserved (pick expiry 14-30 days), Sold (cannot undo), Close.
- "S30 Listing Analytics [Desktop]": KPI cards and charts: views (#3B82F6), saves, chats, speed-sell vs nearby (#F97316).
Name every frame exactly as written in quotes.
```

### 7/11 · M5 นายหน้า ตอนที่ 1 (S31–S34)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 5 Agent part 1, 4 screens:
- "S31 KYC Upload [Desktop]": upload ID card (auto watermark), agent license, accept terms, submit.
- "S32 KYC Status [Desktop]": pending (within 24 hours), can post 2 listings while waiting, approved state with Verified badge, rejected state with reason.
- "S33 Agent Hub [Desktop]": grid of owner listings open for agents, filters location / price / Open-Exclusive, commission shown on cards.
- "S34 Hub Property [Desktop]": property detail plus commission terms and button "ขอรับช่วยขาย".
Name every frame exactly as written in quotes.
```

### 8/11 · M5 นายหน้า ตอนที่ 2 (S35–S38)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 5 Agent part 2, 4 screens:
- "S35 Demand Board [Desktop]": buyer demands on a map with approximate circles plus list, VIP demands on top with amber badge.
- "S36 Send Offer [Desktop]": pick a property from my portfolio, message, attach PDF summary, weekly quota counter.
- "S37 Agent Dashboard [Desktop]": Verified badge, package, quota, new leads, sent offers, shortcuts to Hub and Demand Board.
- "S38 Agent Microsite [Desktop]": public profile page: photo, bio, reviews, all listings, shareable link.
Name every frame exactly as written in quotes.
```

### 9/11 · M6 แพ็กเกจ & ชำระเงิน (S39–S44)
```text
Follow DESIGN.md. Desktop only (1440px). Generate Module 6 Payment, 6 screens:
- "S39 Packages [Desktop]": pricing table by role: Buyer VIP 59฿, Owner Boost 99฿/month, Agent Pro 299฿/month, Agency 1,490฿/month. Monthly/Yearly toggle.
- "S40 Cart [Desktop]": items, promo code, subtotal, VAT 7%, total, button "ชำระเงิน".
- "S41 PromptPay QR [Desktop]": large PromptPay QR with exact amount, 15:00 countdown, save QR button, auto-confirm note.
- "S42 Payment Success [Desktop]": success icon, unlocked benefits, download e-receipt, button "เริ่มใช้งาน".
- "S43 Payment Timeout [Desktop]": order cancelled, button "สร้าง QR ใหม่", refund help link.
- "S44 Orders & Receipts [Desktop]": order history table, status, receipts, active package expiry.
Name every frame exactly as written in quotes.
```

### 10/11 · M7 แอดมิน ตอนที่ 1 (S45–S48)
```text
Follow DESIGN.md. Desktop only (1440px). Admin back-office with left sidebar. Generate Module 7 Admin part 1, 4 screens:
- "S45 Admin Dashboard [Desktop]": KPI cards (pending KYC, pending listings, reports, today revenue, new users), charts, left sidebar menu.
- "S46 KYC Queue [Desktop]": queue table with 24h SLA timer, document viewer, Approve / Reject with reason.
- "S47 Listing Review [Desktop]": new listings and merged duplicates, Approve / Hide with reason.
- "S48 Reports & Scam [Desktop]": reports and flagged chats, actions Warn / Suspend, decision history.
Name every frame exactly as written in quotes.
```

### 11/11 · M7 แอดมิน ตอนที่ 2 (S49–S52)
```text
Follow DESIGN.md. Desktop only (1440px). Same admin sidebar. Generate Module 7 Admin part 2, 4 screens:
- "S49 Stale Listings [Desktop]": reserved listings past due, ask owner, auto-archive after 30 days, 7-day warnings.
- "S50 Packages & Promo [Desktop]": edit package price / quota, flash sale, discount codes.
- "S51 Orders & Refunds [Desktop]": orders with webhook status, refund late payments, reissue receipt.
- "S52 User Management [Desktop]": search users, roles, history, suspend / unsuspend, PDPA consent log.
Name every frame exactly as written in quotes.
```

---

## รอบที่ 2 · Mobile (สลับเป็นโหมด App)

ใช้คำสั่งแม่แบบนี้ทีละ Module (เปลี่ยนเลขในวงเล็บ) — ไม่ต้องทำ M7 แอดมิน

```text
Follow DESIGN.md. Mobile only (390px). Create mobile versions of the existing screens S06 to S10.
Keep the same content and data. Use a bottom tab bar (สำรวจ / บันทึก / แชท / โปรไฟล์). Modals become bottom sheets.
On S06 and S08 (search results): hide the tab bar, show a back button, and float the view switcher รายการ | รูปภาพ | แผนที่ at the bottom center like Agoda.
Name frames as "<CODE> <Screen Name> [Mobile]", e.g. "S06 Map View [Mobile]".
```

ลำดับที่แนะนำ: `S01–S05` ➜ `S06–S10` ➜ `S11–S14` ➜ `S15–S20` ➜ `S21–S25` ➜ `S26–S30` ➜ `S31–S34` ➜ `S35–S38` ➜ `S39–S44`

---

## รอบที่ 3 · Tablet (ถ้าต้องการ — ทำเฉพาะหน้าหลัก)

```text
Follow DESIGN.md. Tablet only (834px portrait). Create tablet versions of S06, S08, S09 and S21.
S06 and S08 use a split view: map 50% left, property list 50% right.
Name frames as "<CODE> <Screen Name> [Tablet]", e.g. "S06 Map View [Tablet]".
```
