'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_LISTINGS } from '@/data/mock-listings';

interface PackagePlan {
  id: string;
  name: string;
  badge?: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const PACKAGES: PackagePlan[] = [
  {
    id: 'boost_7d',
    name: 'บูสต์ดันประกาศ 7 วัน (Boost Listing)',
    price: 199,
    period: 'ต่อ 7 วัน / 1 ประกาศ',
    description: 'ดันประกาศของคุณขึ้นอันดับต้นๆ ในหน้าผลการค้นหา เพิ่มโอกาสปิดการขายเร็วขึ้น 3 เท่า',
    features: [
      'ดันขึ้นอันดับแรกในผลการค้นหา',
      'รีเฟรชเวลาประกาศอัตโนมัติทุก 24 ชม.',
      'ป้ายกำกับ "ประกาศติดดาว" เด่นสะดุดตา',
      'สถิติการคลิกและการเปิดดูรายวัน',
    ],
  },
  {
    id: 'spotlight_14d',
    name: 'หมุดทองคำบนแผนที่ (Spotlight Map Pin)',
    badge: 'ยอดนิยมสูงสุด',
    isPopular: true,
    price: 499,
    period: 'ต่อ 14 วัน / 1 ประกาศ',
    description: 'หมุดสีทองขนาดใหญ่โดดเด่นบนแผนที่อุดรธานี ดึงดูดสายตาผู้ซื้อทันทีที่เปิดแอป',
    features: [
      'หมุดสีทองอร่ามขยายขนาดบนแผนที่',
      'ปักหมุดค้างในทำเลแม้ซูมออก',
      'แสดงในการ์ดแนะนำพิเศษด้านล่างแผนที่',
      'เพิ่มการมองเห็นมากกว่าปกติ 5 เท่า',
      'รองรับการแชร์ลงโซเชียลมีเดียพร้อมลิงก์สั้น',
    ],
  },
  {
    id: 'agent_pro',
    name: 'นายหน้ามืออาชีพ (Super Agent Pro)',
    badge: 'คุ้มค่าสำหรับเอเจนต์',
    price: 1490,
    period: 'ต่อเดือน (30 วัน)',
    description: 'เครื่องมือและโควตาลงประกาศครบวงจรสำหรับนายหน้าอสังหาริมทรัพย์ในอุดรธานี',
    features: [
      'โควตาลงประกาศพร้อมกันสูงสุด 50 ทรัพย์',
      'สิทธิ์เข้าถึงศูนย์กลาง Co-Broker Hub ไม่จำกัด',
      'ป้ายตราสัญลักษณ์ "Verified Agent Pro"',
      'สร้างสัญญาดิจิทัล MOU แบบร่างมาตรฐานฟรี',
      'รับข้อเสนอตรงจากกระดานความต้องการ (Demand Board)',
    ],
  },
];

export default function PackagesPage() {
  const [selectedPlan, setSelectedPlan] = useState<PackagePlan | null>(null);
  const [selectedListingCode, setSelectedListingCode] = useState('UD-00101');
  const [paymentStep, setPaymentStep] = useState<'plan' | 'qr' | 'success'>('plan');
  const [timerSeconds, setTimerSeconds] = useState(899); // 14:59

  // QR countdown timer
  useEffect(() => {
    if (paymentStep !== 'qr') return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentStep]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectPackage = (plan: PackagePlan) => {
    setSelectedPlan(plan);
    setTimerSeconds(899);
    setPaymentStep('qr');
  };

  const handleSimulatePaid = () => {
    setPaymentStep('success');
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-3">
            <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
            <span>MapNest Boost & Spotlight Service</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            แพ็กเกจโปรโมทและเพิ่มการมองเห็น
          </h1>
          <p className="text-sm text-muted mt-2">
            เลือกแพ็กเกจเพื่อเร่งการปิดการขาย เพิ่มยอดผู้เข้าชม และทำให้ทรัพย์ของคุณเป็นจุดเด่นที่สุดในเมืองอุดรธานี
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? 'border-primary bg-surface shadow-xl ring-2 ring-primary/20 scale-102'
                  : 'border-border bg-surface shadow-xs hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-primary text-white shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted mt-2 min-h-[36px]">{plan.description}</p>

                {/* Price display */}
                <div className="my-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-foreground">
                      ฿{plan.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-muted font-medium">{plan.period}</span>
                </div>

                {/* Features list */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold text-foreground">สิทธิประโยชน์ในแพ็กเกจ:</div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPackage(plan)}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  plan.isPopular
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-md'
                    : 'bg-slate-100 hover:bg-primary hover:text-white text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                <span>เลือกแพ็กเกจนี้</span>
              </button>
            </div>
          ))}
        </div>

        {/* S41 PromptPay QR Modal */}
        {paymentStep === 'qr' && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
            <div className="bg-surface rounded-3xl border border-border p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">qr_code_2</span>
                  <h3 className="text-base font-bold text-foreground">ชำระเงินผ่าน PromptPay QR</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentStep('plan')}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-muted cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="pt-4 flex flex-col items-center text-center">
                {/* Thai QR Payment PromptPay Header */}
                <div className="w-full bg-[#113566] text-white py-2 rounded-t-xl font-bold text-xs tracking-wider flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">account_balance</span>
                  <span>THAI QR PAYMENT — PROMPTPAY</span>
                </div>

                {/* QR Code Container */}
                <div className="p-4 bg-white border border-slate-200 w-full flex flex-col items-center justify-center">
                  <div className="w-48 h-48 bg-slate-50 border-2 border-slate-900 rounded-lg p-2 flex flex-col items-center justify-center relative">
                    {/* Simulated High-Res QR Matrix Pattern */}
                    <div className="grid grid-cols-6 gap-1 w-full h-full p-2">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            [0, 1, 4, 5, 6, 11, 14, 17, 20, 24, 29, 30, 31, 34, 35].includes(i)
                              ? 'bg-slate-900'
                              : i % 3 === 0
                              ? 'bg-teal-900'
                              : 'bg-transparent'
                          } rounded-xs`}
                        />
                      ))}
                    </div>
                    {/* Centered Thai QR Logo */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 bg-white rounded-md shadow-xs border border-slate-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px] text-[#113566]">
                          qr_code
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-slate-500 font-mono">
                    REF: MN-202610-9831-UD
                  </div>
                </div>

                {/* Amount & Timer */}
                <div className="w-full bg-slate-50 p-3 rounded-b-xl border border-t-0 border-slate-200">
                  <div className="text-xs text-muted">ยอดชำระสุทธิ (รวมภาษีมูลค่าเพิ่ม)</div>
                  <div className="text-2xl font-black text-primary mt-0.5">
                    ฿{selectedPlan.price.toLocaleString()}.00
                  </div>
                  <div className="text-xs text-amber-600 font-semibold flex items-center justify-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span>หมดอายุใน {formatTimer(timerSeconds)} นาที</span>
                  </div>
                </div>

                {/* Target Listing Selector */}
                <div className="w-full text-left mt-4">
                  <label className="block text-xs font-bold text-foreground mb-1">
                    เลือกประกาศที่ต้องการใช้งานแพ็กเกจ
                  </label>
                  <select
                    value={selectedListingCode}
                    onChange={(e) => setSelectedListingCode(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-medium focus:border-primary focus:outline-none"
                  >
                    {MOCK_LISTINGS.map((l) => (
                      <option key={l.id} value={l.code}>
                        [{l.code}] {l.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Simulate Payment Button */}
                <div className="w-full mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSimulatePaid}
                    className="w-full py-2.5 bg-status-active hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>จำลองสแกนชำระเงินสำเร็จ (Simulate Instant Payment)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentStep('plan')}
                    className="w-full py-2 text-xs text-muted hover:text-foreground cursor-pointer"
                  >
                    ยกเลิกและเลือกแพ็กเกจใหม่
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* S42 Payment Success Modal */}
        {paymentStep === 'success' && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
            <div className="bg-surface rounded-3xl border border-border p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-status-active/10 text-status-active flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800">
                เลขที่ใบเสร็จ: INV-202610-0042
              </span>

              <h3 className="text-xl font-black text-foreground mt-3">ชำระเงินสำเร็จแล้ว!</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                แพ็กเกจ <span className="font-bold text-foreground">{selectedPlan.name}</span> ได้รับการเปิดใช้งานกับประกาศรหัส <span className="font-bold text-primary">{selectedListingCode}</span> เรียบร้อยแล้ว
              </p>

              <div className="my-5 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">จำนวนเงินที่ชำระ:</span>
                  <span className="font-bold text-foreground">฿{selectedPlan.price.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">วิธีการชำระ:</span>
                  <span className="font-bold text-foreground">PromptPay QR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">วันหมดอายุของแพ็กเกจ:</span>
                  <span className="font-bold text-foreground">16 ตุลาคม 2026 (14 วัน)</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href={`/listing/${selectedListingCode}`}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  <span>ดูประกาศที่ได้รับการโปรโมท</span>
                </Link>
                <Link
                  href="/my-listings"
                  className="w-full py-2 bg-surface border border-border text-foreground rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  กลับสู่หน้าจัดการประกาศของฉัน
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
