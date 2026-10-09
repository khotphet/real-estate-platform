'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';

export default function CreateDemandPage() {
  const router = useRouter();
  const [dealType, setDealType] = useState<'buy' | 'rent'>('buy');
  const [propertyType, setPropertyType] = useState('detached_house');
  const [budgetMin, setBudgetMin] = useState('3,000,000');
  const [budgetMax, setBudgetMax] = useState('5,500,000');
  const [targetZone, setTargetZone] = useState('รอบสวนสาธารณะหนองประจักษ์ / ถ.โพศรี');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [parking, setParking] = useState('2');
  const [urgency, setUrgency] = useState('within_1_month');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('คุณวิชัย รัตนประเสริฐ');
  const [phone, setPhone] = useState('089-123-4567');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted mb-4">
          <Link href="/" className="hover:text-primary transition-colors">หน้าแรก</Link>
          <span>/</span>
          <Link href="/demands" className="hover:text-primary transition-colors">กระดานความต้องการ</Link>
          <span>/</span>
          <span className="text-foreground font-semibold">ปักหมุดความต้องการ</span>
        </div>

        {isSubmitted ? (
          <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 text-center shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-status-active/10 text-status-active flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800">
              รหัสหมุด: DM-UD-806
            </span>
            <h2 className="text-2xl font-black text-foreground mt-3">ปักหมุดความต้องการสำเร็จ!</h2>
            <p className="text-sm text-muted max-w-md mx-auto mt-2 leading-relaxed">
              ความต้องการของคุณถูกเผยแพร่บนกระดานความต้องการอุดรธานีแล้ว นายหน้าและเจ้าของทรัพย์ที่ตรงกับงบประมาณ {budgetMin} – {budgetMax} บาท จะเริ่มยื่นข้อเสนอผ่านระบบแชท
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/demands"
                className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
              >
                ดูกระดานความต้องการ
              </Link>
              <Link
                href="/messages"
                className="w-full sm:w-auto px-6 py-2.5 bg-surface border border-border text-foreground rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                ไปที่กล่องข้อความ
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xs">
            <div className="mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
                <span>S13 Post Demand Pin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                ปักหมุดบอกความต้องการ (Reverse Pin)
              </h1>
              <p className="text-sm text-muted mt-1">
                หาทรัพย์ที่ถูกใจไม่เจอ? ระบุงบและทำเลที่ต้องการในอุดรธานี ให้เจ้าของทรัพย์และนายหน้ายื่นข้อเสนอมาหาคุณโดยตรง
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Deal Type */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">จุดประสงค์</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDealType('buy');
                      setBudgetMin('3,000,000');
                      setBudgetMax('5,500,000');
                    }}
                    className={`p-3.5 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      dealType === 'buy'
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-border text-muted hover:border-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    <span>ต้องการซื้อ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDealType('rent');
                      setBudgetMin('8,000');
                      setBudgetMax('15,000');
                    }}
                    className={`p-3.5 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      dealType === 'rent'
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-border text-muted hover:border-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">key</span>
                    <span>ต้องการเช่า</span>
                  </button>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">ประเภทอสังหาริมทรัพย์</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'detached_house', label: 'บ้านเดี่ยว', icon: 'home' },
                    { id: 'condo', label: 'คอนโดมิเนียม', icon: 'apartment' },
                    { id: 'townhome', label: 'ทาวน์โฮม', icon: 'holiday_village' },
                    { id: 'commercial', label: 'อาคารพาณิชย์', icon: 'storefront' },
                    { id: 'land', label: 'ที่ดินเปล่า', icon: 'landscape' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPropertyType(t.id)}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                        propertyType === t.id
                          ? 'border-primary bg-primary text-white shadow-xs'
                          : 'border-border text-slate-700 hover:border-slate-300 bg-background'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">
                  ช่วงงบประมาณ ({dealType === 'buy' ? 'บาท' : 'บาท / เดือน'})
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-muted mb-1 block">งบขั้นต่ำ</span>
                    <input
                      type="text"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted mb-1 block">งบสูงสุดที่รับได้</span>
                    <input
                      type="text"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Target Zone in Udon */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">
                  ทำเลที่สนใจในจังหวัดอุดรธานี
                </label>
                <select
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none"
                >
                  <option value="รอบสวนสาธารณะหนองประจักษ์ / ถ.โพศรี">
                    รอบสวนสาธารณะหนองประจักษ์ / ถ.โพศรี
                  </option>
                  <option value="ใจกลางเมือง / เซ็นทรัลพลาซา / ยูดีทาวน์ (UD Town)">
                    ใจกลางเมือง / เซ็นทรัลพลาซา / ยูดีทาวน์ (UD Town)
                  </option>
                  <option value="โซนสนามบินอุดรธานี / ถ.ทหาร / ค่ายประจักษ์">
                    โซนสนามบินอุดรธานี / ถ.ทหาร / ค่ายประจักษ์
                  </option>
                  <option value="โซนหนองสำโรง / บ้านเลื่อม / ม.ราชภัฏอุดร">
                    โซนหนองสำโรง / บ้านเลื่อม / ม.ราชภัฏอุดร
                  </option>
                  <option value="โซนถนนมิตรภาพ / หนองบัว / บิ๊กซีอุดรธานี">
                    โซนถนนมิตรภาพ / หนองบัว / บิ๊กซีอุดรธานี
                  </option>
                  <option value="โซนรอบเมืองเลี่ยงเมือง (Ring Road) ทุกฝั่ง">
                    โซนรอบเมืองเลี่ยงเมือง (Ring Road) ทุกฝั่ง
                  </option>
                </select>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">ห้องนอน (ขั้นต่ำ)</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none"
                  >
                    <option value="1">1 ห้องนอน</option>
                    <option value="2">2 ห้องนอน</option>
                    <option value="3">3 ห้องนอน</option>
                    <option value="4+">4+ ห้องนอน</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">ห้องน้ำ</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none"
                  >
                    <option value="1">1 ห้องน้ำ</option>
                    <option value="2">2 ห้องน้ำ</option>
                    <option value="3+">3+ ห้องน้ำ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">ที่จอดรถ</label>
                  <select
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm font-medium focus:border-primary focus:outline-none"
                  >
                    <option value="1">1 คัน</option>
                    <option value="2">2 คันขึ้นไป</option>
                    <option value="3+">3+ คัน</option>
                  </select>
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">ความเร่งด่วน</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'immediate', label: 'เข้าอยู่ทันที' },
                    { id: 'within_1_month', label: 'ภายใน 1 เดือน' },
                    { id: 'within_3_months', label: 'ภายใน 3 เดือน' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center cursor-pointer transition-all ${
                        urgency === u.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted hover:border-slate-300'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  รายละเอียดเพิ่มเติมที่ต้องการเป็นพิเศษ (ถ้ามี)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น ต้องการบ้านทิศเหนือ วิวสวน ไม่รับซอยตัน หรือต้องการใกล้โรงเรียนอุดรพิทยานุกูล..."
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Privacy protection notice */}
              <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                  verified_user
                </span>
                <div className="text-xs text-teal-900 leading-relaxed">
                  <span className="font-bold">นโยบายความเป็นส่วนตัว MapNest:</span>{' '}
                  เบอร์โทรศัพท์ของคุณจะไม่ถูกเปิดเผยต่อสาธารณะ ผู้ขายและนายหน้าจะส่งข้อเสนอพร้อมภาพถ่ายผ่านกล่องข้อความในระบบเท่านั้น คุณสามารถเลือกเปิดเผยเบอร์โทรเมื่อพอใจข้อเสนอ
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <Link
                  href="/demands"
                  className="text-xs font-semibold text-muted hover:text-foreground"
                >
                  ← กลับสู่กระดานความต้องการ
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                      <span>กำลังปักหมุด...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                      <span>ยืนยันปักหมุดความต้องการ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
