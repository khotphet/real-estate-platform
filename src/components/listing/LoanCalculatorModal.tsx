'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, Calculator, CheckCircle2, AlertTriangle, Building2, ChevronRight, Phone, Send } from 'lucide-react';
import { Listing } from '@/types/listing';
import { calculateMortgage, DEFAULT_MORTGAGE_CONFIG } from '@/lib/mortgage';
import { useAuth } from '@/context/AuthContext';

interface LoanCalculatorModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export function LoanCalculatorModal({ listing, isOpen, onClose }: LoanCalculatorModalProps) {
  const { user } = useAuth();
  const propertyPrice = listing.price || 1450000;

  const [price, setPrice] = useState<number>(propertyPrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(DEFAULT_MORTGAGE_CONFIG.downPaymentPct);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(
    Math.round(propertyPrice * (DEFAULT_MORTGAGE_CONFIG.downPaymentPct / 100))
  );
  const [loanTermYears, setLoanTermYears] = useState<number>(DEFAULT_MORTGAGE_CONFIG.loanTermYears);
  const [interestRate, setInterestRate] = useState<number>(DEFAULT_MORTGAGE_CONFIG.interestRate);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(DEFAULT_MORTGAGE_CONFIG.monthlyIncome);
  const [selectedBank, setSelectedBank] = useState<string>('ธอส. (ธนาคารอาคารสงเคราะห์)');
  const [contactPhone, setContactPhone] = useState<string>(user?.phone || '089-123-4567');
  const [isConsulting, setIsConsulting] = useState<boolean>(false);
  const [consultSubmitted, setConsultSubmitted] = useState<boolean>(false);

  // Sync state whenever the modal opens or the listing changes
  useEffect(() => {
    if (isOpen) {
      const p = listing.price || 1450000;
      setPrice(p);
      setDownPaymentPct(DEFAULT_MORTGAGE_CONFIG.downPaymentPct);
      setDownPaymentAmount(Math.round(p * (DEFAULT_MORTGAGE_CONFIG.downPaymentPct / 100)));
      setLoanTermYears(DEFAULT_MORTGAGE_CONFIG.loanTermYears);
      setInterestRate(DEFAULT_MORTGAGE_CONFIG.interestRate);
      setMonthlyIncome(DEFAULT_MORTGAGE_CONFIG.monthlyIncome);
      setConsultSubmitted(false);
      setIsConsulting(false);
      if (user?.phone) setContactPhone(user.phone);
    }
  }, [isOpen, listing.price, listing.code, user?.phone]);

  // Handle down payment percentage changes
  const handleDownPaymentPctChange = (pct: number) => {
    setDownPaymentPct(pct);
    setDownPaymentAmount(Math.round(price * (pct / 100)));
  };

  // Perform mortgage calculation using the standard Thai bank PMT formula
  const calculation = useMemo(() => {
    return calculateMortgage({
      price,
      downPaymentAmount,
      loanTermYears,
      interestRate,
      monthlyIncome,
    });
  }, [price, downPaymentAmount, loanTermYears, interestRate, monthlyIncome]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[940px] bg-surface-card rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-border-subtle">
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 flex items-center justify-between border-b border-border-subtle shrink-0 bg-surface-card">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-light text-primary shrink-0">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface">
                คำนวณสินเชื่อบ้าน & ยอดผ่อนชำระ
              </h2>
              <p className="text-xs text-text-muted line-clamp-1">
                วางแผนงบประมาณและประมาณการค่างวดรายเดือนสำหรับ {listing.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-canvas-background text-text-muted hover:text-on-surface hover:bg-surface-container transition-colors shrink-0 cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body (min-h-0 flex-1 ensures proper scroll on all screen sizes) */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Property Mini Bar */}
          <div className="p-3 bg-canvas-background rounded-xl flex flex-wrap items-center justify-between gap-3 border border-border-subtle">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  src={listing.images[0]}
                  alt={listing.title}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs sm:text-sm font-bold text-on-surface truncate">
                  {listing.title}
                </span>
                <span className="text-[11px] text-text-muted">
                  {listing.specs.unitType || 'ที่พักอาศัย'}{' '}
                  {listing.specs.usableAreaSqm ? `· ${listing.specs.usableAreaSqm} ตร.ม.` : ''} ·{' '}
                  {listing.location.subdistrict}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted">ราคาอสังหาริมทรัพย์</span>
                <span className="text-sm font-black text-primary">
                  {listing.priceFormatted}
                </span>
              </div>
              <div className="h-6 w-px bg-border-subtle hidden sm:block"></div>
              <div className="flex flex-col hidden sm:flex">
                <span className="text-[10px] text-text-muted">อัตราดอกเบี้ยเบื้องต้น</span>
                <span className="text-xs text-primary font-bold">
                  {interestRate.toFixed(2)}% ต่อปี
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Interactive Inputs */}
            <div className="lg:col-span-7 flex flex-col gap-3.5">
              {/* Property Price Input */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold text-on-surface">
                  <label htmlFor="priceInput">ราคาอสังหาริมทรัพย์ (บาท)</label>
                  <span className="text-text-muted font-normal text-[11px]">ระบุยอดราคาขายจริง</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted font-bold text-sm">฿</span>
                  <input
                    id="priceInput"
                    type="number"
                    value={price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPrice(val);
                      setDownPaymentAmount(Math.round(val * (downPaymentPct / 100)));
                    }}
                    className="w-full pl-7 pr-3 py-2 bg-surface-card border border-border-subtle rounded-xl text-sm font-semibold text-on-surface shadow-xs focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Down Payment Section */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label htmlFor="downPaymentInput">วงเงินดาวน์ (บาท / สัดส่วน)</label>
                  <span className="text-primary font-bold">
                    ยอดขอกู้: ฿{calculation.loanAmount.toLocaleString()}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted font-bold text-sm">฿</span>
                  <input
                    id="downPaymentInput"
                    type="number"
                    value={downPaymentAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDownPaymentAmount(val);
                      if (price > 0) {
                        setDownPaymentPct(Math.round((val / price) * 100));
                      }
                    }}
                    className="w-full pl-7 pr-3 py-2 bg-surface-card border border-border-subtle rounded-xl text-sm font-semibold text-on-surface shadow-xs focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                {/* Down Payment % Chips */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleDownPaymentPctChange(pct)}
                      className={`py-1 text-center rounded-lg text-xs transition-all cursor-pointer ${
                        downPaymentPct === pct
                          ? 'bg-primary-light text-primary border border-primary font-bold shadow-xs'
                          : 'bg-canvas-background text-on-surface hover:bg-slate-100 border border-border-subtle'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Term Range Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label htmlFor="loanTermRange">ระยะเวลากู้</label>
                  <span className="px-2 py-0.5 rounded bg-canvas-background text-primary font-bold border border-border-subtle text-xs">
                    {loanTermYears} ปี ({loanTermYears * 12} งวด)
                  </span>
                </div>
                <input
                  id="loanTermRange"
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-text-muted px-0.5">
                  <span>5 ปี</span>
                  <span>10 ปี</span>
                  <span>20 ปี</span>
                  <span>30 ปี</span>
                </div>
              </div>

              {/* Interest Rate Input & Presets */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label htmlFor="interestInput">อัตราดอกเบี้ยเฉลี่ยต่อปี (%)</label>
                  <span className="text-text-muted font-normal text-[11px]">เฉลี่ย 3 ปีแรก</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="interestInput"
                    type="number"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 bg-surface-card border border-border-subtle rounded-xl text-sm font-semibold text-on-surface shadow-xs focus:outline-none focus:border-primary transition-all"
                  />
                  <span className="absolute right-3 text-text-muted font-bold text-xs">%</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[11px] text-text-muted">อัตราตลาด:</span>
                  {[
                    { label: 'ธอส. พิเศษ 3.25%', rate: 3.25 },
                    { label: 'เฉลี่ย 3.50%', rate: 3.5 },
                    { label: 'SCB 3.65%', rate: 3.65 },
                    { label: 'KBANK 3.75%', rate: 3.75 },
                  ].map((bank) => (
                    <button
                      key={bank.rate}
                      type="button"
                      onClick={() => setInterestRate(bank.rate)}
                      className={`px-2 py-0.5 rounded-full text-[11px] border transition-colors cursor-pointer ${
                        interestRate === bank.rate
                          ? 'bg-primary-light text-primary border-primary font-bold'
                          : 'bg-canvas-background hover:bg-slate-100 border-border-subtle text-slate-700'
                      }`}
                    >
                      {bank.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Income DSR Input */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-canvas-background border border-border-subtle">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <label htmlFor="incomeInput" className="flex items-center gap-1 text-on-surface">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span>รายได้รวมต่อเดือนของผู้กู้ (บาท)</span>
                  </label>
                  <span className="text-text-muted font-normal text-[11px]">ประเมินภาระหนี้ DSR</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted font-bold text-sm">฿</span>
                  <input
                    id="incomeInput"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-surface-card border border-border-subtle rounded-lg text-sm font-semibold text-on-surface shadow-xs focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Output & DSR Assessment */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4 bg-canvas-background p-4 sm:p-5 rounded-2xl border border-border-subtle">
              <div className="flex flex-col gap-3">
                {/* Hero Monthly Payment */}
                <div className="flex flex-col pb-3 border-b border-border-subtle">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    ยอดผ่อนชำระประมาณการ
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                      ฿{calculation.monthlyPayment.toLocaleString()}
                    </span>
                    <span className="text-xs text-text-muted font-medium">/ เดือน</span>
                  </div>
                </div>

                {/* Feasibility Indicator Badge */}
                {calculation.dsr <= 40 ? (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="leading-snug">
                      <span className="font-bold text-emerald-900 block">
                        ความสามารถในการกู้: อยู่ในเกณฑ์ดี
                      </span>
                      <span>
                        สัดส่วนภาระหนี้ผ่อน DSR ประมาณ {calculation.dsr}% (เกณฑ์มาตรฐานไม่เกิน 40%)
                      </span>
                    </div>
                  </div>
                ) : calculation.dsr <= 60 ? (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="leading-snug">
                      <span className="font-bold text-amber-900 block">
                        ความสามารถในการกู้: ปานกลาง
                      </span>
                      <span>
                        สัดส่วนภาระหนี้ผ่อน DSR อยู่ที่ {calculation.dsr}% แนะนำให้มีผู้กู้ร่วม
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="leading-snug">
                      <span className="font-bold text-rose-900 block">
                        ภาระหนี้ค่อนข้างสูง (DSR {calculation.dsr}%)
                      </span>
                      <span>แนะนำเพิ่มเงินดาวน์หรือยื่นกู้ร่วมเพื่อให้อนุมัติง่ายขึ้น</span>
                    </div>
                  </div>
                )}

                {/* Principal & Interest Breakdown */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                      <span>เงินต้นต่องวด ({calculation.principalPct}%)</span>
                    </span>
                    <span className="font-bold text-on-surface">
                      ฿{calculation.principalPortion.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span>ดอกเบี้ยต่องวด ({calculation.interestPct}%)</span>
                    </span>
                    <span className="font-bold text-on-surface">
                      ฿{calculation.interestPortion.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar visually showing Principal vs Interest */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  {calculation.monthlyPayment > 0 && (
                    <>
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${calculation.principalPct}%` }}
                      ></div>
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{ width: `${calculation.interestPct}%` }}
                      ></div>
                    </>
                  )}
                </div>
              </div>

              {/* Consultation Lead Box */}
              <div className="pt-3 border-t border-border-subtle">
                {consultSubmitted ? (
                  <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 rounded-xl text-center text-xs font-semibold">
                    <div className="flex items-center justify-center gap-1.5 mb-1 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-bold">ส่งคำขอปรึกษาสินเชื่อสำเร็จ!</span>
                    </div>
                    <div>
                      เจ้าหน้าที่สินเชื่อ {selectedBank.split(' ')[0]} จะติดต่อกลับที่ {contactPhone} ภายใน 24 ชม.
                    </div>
                  </div>
                ) : isConsulting ? (
                  <div className="p-3 bg-surface-card rounded-xl border border-primary/30 space-y-2.5 text-xs">
                    <div className="font-bold text-foreground flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <span>ยืนยันข้อมูลติดต่อเจ้าหน้าที่สินเชื่อ</span>
                    </div>
                    <div>
                      <label className="text-[11px] text-muted block mb-1">ธนาคารที่ต้องการปรึกษา:</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2 bg-canvas-background border border-border-subtle rounded-lg text-xs font-medium"
                      >
                        <option value="ธอส. (ธนาคารอาคารสงเคราะห์)">ธอส. (ธนาคารอาคารสงเคราะห์)</option>
                        <option value="SCB (ธนาคารไทยพาณิชย์)">SCB (ธนาคารไทยพาณิชย์)</option>
                        <option value="KBANK (ธนาคารกสิกรไทย)">KBANK (ธนาคารกสิกรไทย)</option>
                        <option value="ธนาคารกรุงไทย (KTB)">ธนาคารกรุงไทย (KTB)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-muted block mb-1">เบอร์โทรศัพท์สำหรับติดต่อกลับ:</label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full p-2 bg-canvas-background border border-border-subtle rounded-lg text-xs font-medium"
                        placeholder="08X-XXX-XXXX"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setConsultSubmitted(true)}
                        className="flex-1 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>ยืนยันส่งเรื่อง</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConsulting(false)}
                        className="px-3 py-2 border border-border hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsConsulting(true)}
                    className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>ปรึกษาเจ้าหน้าที่สินเชื่อธนาคารพันธมิตร</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[10px] text-text-muted text-center mt-2 leading-relaxed">
                  * การคำนวณข้างต้นเป็นเพียงการประมาณการเบื้องต้น ไม่รวมค่าประกันและค่าธรรมเนียมอื่นๆ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
