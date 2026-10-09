'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_DEMANDS, DemandPin } from '@/data/mock-demands';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export default function DemandsPage() {
  const [dealFilter, setDealFilter] = useState<'all' | 'buy' | 'rent'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedDemand, setSelectedDemand] = useState<DemandPin | null>(null);
  const [offerListingCode, setOfferListingCode] = useState('UD-00101');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerSuccess, setOfferSuccess] = useState(false);

  // Filter logic
  const filteredDemands = MOCK_DEMANDS.filter((d) => {
    if (dealFilter !== 'all' && d.dealType !== dealFilter) return false;
    if (typeFilter !== 'all' && d.propertyType !== typeFilter) return false;
    return true;
  });

  const handleOpenOfferModal = (demand: DemandPin) => {
    setSelectedDemand(demand);
    setOfferPrice(demand.budgetFormatted.split('–')[0].trim());
    setOfferMessage(`สวัสดีครับคุณ${demand.buyerName.split(' ')[0]} ผมมีทรัพย์ที่ตรงกับความต้องการในโซน${demand.targetZone} สภาพใหม่พร้อมเข้าอยู่ สนใจนัดชมได้ครับ`);
    setOfferSuccess(false);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferSuccess(true);
    setTimeout(() => {
      setOfferSuccess(false);
      setSelectedDemand(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner / Header */}
        <div className="relative rounded-3xl bg-linear-to-r from-teal-800 via-primary to-teal-700 text-white p-6 sm:p-10 shadow-lg overflow-hidden mb-8">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md mb-3">
              <span className="material-symbols-outlined text-[16px]">pin_drop</span>
              <span>MapNest Reverse Marketplace</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              กระดานความต้องการซื้อ-เช่า (Demand Board)
            </h1>
            <p className="text-sm sm:text-base text-teal-100 mt-2">
              ผู้ซื้อและผู้เช่าตัวจริงที่ปักหมุดความต้องการในจังหวัดอุดรธานี เจ้าของทรัพย์และนายหน้าสามารถยื่นข้อเสนอทรัพย์ที่ตรงโจทย์ได้ทันที
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/demand/create"
                className="px-5 py-2.5 rounded-xl bg-white text-primary font-bold text-sm hover:bg-teal-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
                <span>ปักหมุดความต้องการของคุณฟรี</span>
              </Link>
              <Link
                href="/"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[20px]">map</span>
                <span>ดูบนแผนที่</span>
              </Link>
            </div>
          </div>

          {/* Background Decorative Graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-[260px] text-white">location_searching</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface rounded-2xl border border-border p-4 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Deal Type Pills */}
            <div className="flex items-center p-1 bg-background border border-border rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setDealFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  dealFilter === 'all' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground'
                }`}
              >
                ทั้งหมด ({MOCK_DEMANDS.length})
              </button>
              <button
                type="button"
                onClick={() => setDealFilter('buy')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  dealFilter === 'buy' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground'
                }`}
              >
                หาซื้อ
              </button>
              <button
                type="button"
                onClick={() => setDealFilter('rent')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  dealFilter === 'rent' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground'
                }`}
              >
                หาเช่า
              </button>
            </div>

            {/* Property Type Dropdown */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-xl text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
            >
              <option value="all">ทุกประเภททรัพย์</option>
              <option value="detached_house">บ้านเดี่ยว</option>
              <option value="condo">คอนโดมิเนียม</option>
              <option value="townhome">ทาวน์โฮม</option>
              <option value="commercial">อาคารพาณิชย์</option>
              <option value="land">ที่ดินเปล่า</option>
            </select>
          </div>

          <div className="text-xs text-muted font-medium">
            แสดง <span className="font-bold text-foreground">{filteredDemands.length}</span> ความต้องการที่กำลังรอข้อเสนอ
          </div>
        </div>

        {/* Demands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemands.map((demand) => (
            <div
              key={demand.id}
              className="bg-surface rounded-2xl border border-border p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Buyer info & Time */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={demand.buyerAvatar}
                      alt={demand.buyerName}
                      className="w-10 h-10 rounded-full object-cover border border-border"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-foreground leading-tight">
                        {demand.buyerName}
                      </h4>
                      <span className="text-[11px] text-muted flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-primary">verified</span>
                        <span>ยืนยันเบอร์โทรแล้ว ({demand.buyerPhoneMasked})</span>
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-muted">{demand.createdAt}</span>
                </div>

                {/* Badges: Deal Type, Property Type & Budget */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      demand.dealType === 'buy' ? 'bg-primary/10 text-primary' : 'bg-blue-600/10 text-blue-600'
                    }`}
                  >
                    {demand.dealType === 'buy' ? 'ต้องการซื้อ' : 'ต้องการเช่า'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    {demand.propertyTypeLabel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700">
                    {demand.urgencyLabel}
                  </span>
                </div>

                {/* Target Budget Highlighting */}
                <div className="p-3 bg-slate-50 rounded-xl mb-3 border border-slate-100">
                  <div className="text-[11px] font-semibold text-muted">งบประมาณที่ตั้งไว้</div>
                  <div className="text-lg font-black text-foreground">{demand.budgetFormatted}</div>
                  <div className="text-xs font-medium text-slate-600 flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[15px] text-primary shrink-0">location_on</span>
                    <span className="line-clamp-1">{demand.targetZone}</span>
                  </div>
                </div>

                {/* Requirements Pills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {demand.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-background border border-border rounded-md text-[11px] text-slate-600 font-medium"
                    >
                      ✓ {req}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs text-muted line-clamp-3 leading-relaxed">
                  {demand.description}
                </p>
              </div>

              {/* Card Footer: Offers count & CTA */}
              <div className="pt-4 mt-4 border-t border-border flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">local_offer</span>
                  <span>{demand.offersCount} ข้อเสนอที่ยื่นแล้ว</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenOfferModal(demand)}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>ยื่นเสนอทรัพย์</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* S36 Send Offer Modal */}
        {selectedDemand && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-surface rounded-2xl border border-border p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">local_offer</span>
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      ยื่นเสนอทรัพย์แก่ {selectedDemand.buyerName}
                    </h3>
                    <p className="text-xs text-muted">รหัสความต้องการ: {selectedDemand.code}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDemand(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-muted cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {offerSuccess ? (
                <div className="py-8 text-center">
                  <span className="material-symbols-outlined text-5xl text-status-active animate-bounce">
                    check_circle
                  </span>
                  <h4 className="text-lg font-bold text-foreground mt-3">ส่งข้อเสนอเรียบร้อยแล้ว!</h4>
                  <p className="text-xs text-muted mt-1">
                    ระบบได้ส่งข้อเสนอทรัพย์ไปยังกล่องข้อความของผู้ซื้อแล้ว คุณสามารถติดตามการตอบกลับได้ที่หน้าแชท
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendOffer} className="space-y-4 pt-4">
                  {/* Select Listing */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      เลือกทรัพย์ของคุณที่ต้องการนำเสนอ
                    </label>
                    <select
                      value={offerListingCode}
                      onChange={(e) => setOfferListingCode(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none"
                    >
                      {MOCK_LISTINGS.map((l) => (
                        <option key={l.id} value={l.code}>
                          [{l.code}] {l.title} — {l.priceFormatted}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Proposed Price */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      ราคาข้อเสนอพิเศษ (บาท)
                    </label>
                    <input
                      type="text"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="เช่น ฿4,500,000 หรือ ต่อรองได้"
                      className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none"
                      required
                    />
                  </div>

                  {/* Message to Buyer */}
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      ข้อความแนะนำทรัพย์ถึงผู้ซื้อ
                    </label>
                    <textarea
                      rows={3}
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none resize-none"
                      required
                    />
                  </div>

                  {/* Commission / Protection Note */}
                  <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-800 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                      security
                    </span>
                    <span>
                      MapNest SafeOffer: ระบบจะป้องกันข้อมูลติดต่อส่วนตัวของคุณ และผู้ซื้อจะสามารถตอบรับผ่านห้องแชทในระบบ
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDemand(null)}
                      className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-muted hover:bg-slate-50 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">send</span>
                      <span>ส่งข้อเสนอทันที</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
