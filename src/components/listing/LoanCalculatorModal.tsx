'use client';

import React, { useState, useMemo } from 'react';
import { X, Calculator, CheckCircle2, AlertTriangle, Building2, ChevronRight } from 'lucide-react';
import { Listing } from '@/types/listing';

interface LoanCalculatorModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

export function LoanCalculatorModal({ listing, isOpen, onClose }: LoanCalculatorModalProps) {
  // Initial price from listing or default 1,450,000
  const propertyPrice = listing.price || 1450000;

  const [price, setPrice] = useState<number>(propertyPrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(10);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(Math.round(propertyPrice * 0.1));
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(3.85);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(25000);
  const [consultSubmitted, setConsultSubmitted] = useState<boolean>(false);

  // When down payment percentage changes
  const handleDownPaymentPctChange = (pct: number) => {
    setDownPaymentPct(pct);
    setDownPaymentAmount(Math.round(price * (pct / 100)));
  };

  // Loan Amount
  const loanAmount = Math.max(0, price - downPaymentAmount);

  // Monthly Payment Formula (PMT): P * [ r(1+r)^n ] / [ (1+r)^n - 1 ]
  const calculation = useMemo(() => {
    if (loanAmount <= 0) {
      return { monthlyPayment: 0, principalPortion: 0, interestPortion: 0, dsr: 0 };
    }
    const r = interestRate / 100 / 12; // monthly rate
    const n = loanTermYears * 12; // total installments

    let monthly = 0;
    if (r === 0) {
      monthly = loanAmount / n;
    } else {
      monthly = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const firstMonthInterest = loanAmount * r;
    const firstMonthPrincipal = Math.max(0, monthly - firstMonthInterest);

    const dsr = monthlyIncome > 0 ? (monthly / monthlyIncome) * 100 : 0;

    return {
      monthlyPayment: Math.round(monthly),
      principalPortion: Math.round(firstMonthPrincipal),
      interestPortion: Math.round(firstMonthInterest),
      dsr: parseFloat(dsr.toFixed(1)),
    };
  }, [loanAmount, interestRate, loanTermYears, monthlyIncome]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-[960px] bg-surface-card rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 flex items-start justify-between border-b border-border-subtle shrink-0">
          <div className="flex flex-col pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-light text-primary">
                <Calculator className="w-4 h-4" />
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                คำนวณสินเชื่อบ้าน & ยอดผ่อนชำระ
              </h2>
            </div>
            <p className="font-body-sm text-body-sm text-text-muted">
              วางแผนงบประมาณและประมาณการค่างวดรายเดือนสำหรับ {listing.title} ({listing.location.province})
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-canvas-background text-text-muted hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Property Mini Bar */}
          <div className="p-3.5 bg-canvas-background rounded-xl flex flex-wrap items-center justify-between gap-3 border border-border-subtle">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                <img
                  className="w-full h-full object-cover"
                  src={listing.images[0]}
                  alt={listing.title}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-lg-bold text-body-lg-bold text-on-surface truncate">
                  {listing.title}
                </span>
                <span className="font-body-sm text-body-sm text-text-muted">
                  {listing.specs.unitType || 'ที่พักอาศัย'} {listing.specs.usableAreaSqm ? `· ${listing.specs.usableAreaSqm} ตร.ม.` : ''} · {listing.location.subdistrict}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right shrink-0">
              <div className="flex flex-col">
                <span className="font-label-xs text-label-xs text-text-muted">ราคาประเมินทรัพย์</span>
                <span className="font-price-sm text-price-sm text-primary font-bold">
                  {listing.priceFormatted}
                </span>
              </div>
              <div className="h-7 w-px bg-border-subtle hidden sm:block"></div>
              <div className="flex flex-col hidden sm:flex">
                <span className="font-label-xs text-label-xs text-text-muted">อัตราดอกเบี้ยเฉลี่ย</span>
                <span className="font-label-xs text-label-xs text-primary font-semibold">
                  3.25% - 4.5% ต่อปี
                </span>
              </div>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Controls */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Property Price Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-body-sm-medium text-body-sm-medium text-on-surface">
                  <label htmlFor="priceInput">ราคาอสังหาริมทรัพย์ (บาท)</label>
                  <span className="text-text-muted font-normal text-xs">ระบุยอดราคาขายจริง</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text-muted font-medium text-body-lg">฿</span>
                  <input
                    id="priceInput"
                    type="number"
                    value={price}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPrice(val);
                      setDownPaymentAmount(Math.round(val * (downPaymentPct / 100)));
                    }}
                    className="w-full pl-8 pr-4 py-2.5 bg-surface-card border border-border-subtle rounded-xl font-body-lg text-body-lg text-on-surface shadow-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Down Payment Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-body-sm-medium text-body-sm-medium text-on-surface" htmlFor="downPaymentInput">
                    วงเงินดาวน์ (บาท / สัดส่วน)
                  </label>
                  <span className="font-label-xs text-label-xs text-primary font-semibold">
                    ยอดขอกู้: ฿{loanAmount.toLocaleString()}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-text-muted font-medium text-body-lg">฿</span>
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
                    className="w-full pl-8 pr-4 py-2.5 bg-surface-card border border-border-subtle rounded-xl font-body-lg text-body-lg text-on-surface shadow-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                {/* Down Payment % Chips */}
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {[0, 5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleDownPaymentPctChange(pct)}
                      className={`py-1.5 px-2 text-center rounded-lg font-label-xs text-label-xs transition-all ${
                        downPaymentPct === pct
                          ? 'bg-primary-light text-primary border border-primary font-bold shadow-sm'
                          : 'bg-canvas-background text-on-surface hover:bg-surface-container border border-border-subtle'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Term Range Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-body-sm-medium text-body-sm-medium text-on-surface" htmlFor="loanTermRange">
                    ระยะเวลากู้
                  </label>
                  <span className="px-2.5 py-0.5 rounded-md bg-canvas-background font-price-sm text-price-sm text-primary font-bold border border-border-subtle">
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
                  className="w-full accent-primary cursor-pointer h-2 bg-canvas-background rounded-lg"
                />
                <div className="flex justify-between font-label-xs text-label-xs text-text-muted px-0.5">
                  <span>5 ปี</span>
                  <span>10 ปี</span>
                  <span>20 ปี</span>
                  <span>30 ปี</span>
                </div>
              </div>

              {/* Interest Rate Input & Presets */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="font-body-sm-medium text-body-sm-medium text-on-surface" htmlFor="interestInput">
                    อัตราดอกเบี้ยเฉลี่ยต่อปี (%)
                  </label>
                  <span className="text-text-muted font-label-xs text-label-xs">เฉลี่ย 3 ปีแรก</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    id="interestInput"
                    type="number"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full pl-4 pr-10 py-2.5 bg-surface-card border border-border-subtle rounded-xl font-body-lg text-body-lg text-on-surface shadow-sm focus:outline-none focus:border-primary transition-all"
                  />
                  <span className="absolute right-3.5 text-text-muted font-medium text-body-sm">%</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="font-label-xs text-label-xs text-text-muted">อัตราตลาด:</span>
                  {[
                    { label: 'ธอส. พิเศษ 3.25%', rate: 3.25 },
                    { label: 'SCB 3.65%', rate: 3.65 },
                    { label: 'KBANK 3.75%', rate: 3.75 },
                  ].map((bank) => (
                    <button
                      key={bank.rate}
                      type="button"
                      onClick={() => setInterestRate(bank.rate)}
                      className={`px-2.5 py-1 rounded-full font-label-xs text-label-xs border transition-colors ${
                        interestRate === bank.rate
                          ? 'bg-primary-light text-primary border-primary font-semibold'
                          : 'bg-canvas-background hover:bg-surface-container border-border-subtle text-on-surface'
                      }`}
                    >
                      {bank.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Income DSR Input */}
              <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-canvas-background border border-border-subtle">
                <div className="flex items-center justify-between">
                  <label className="font-body-sm-medium text-body-sm-medium text-on-surface flex items-center gap-1.5" htmlFor="incomeInput">
                    <Building2 className="w-4 h-4 text-primary" />
                    รายได้รวมต่อเดือนของผู้กู้ (บาท)
                  </label>
                  <span className="text-text-muted font-label-xs text-label-xs">ประเมินภาระหนี้ DSR</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-text-muted font-medium text-body-sm">฿</span>
                  <input
                    id="incomeInput"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 bg-surface-card border border-border-subtle rounded-lg font-body-sm text-body-sm text-on-surface shadow-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Output & DSR Assessment */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5 bg-canvas-background p-5 rounded-2xl border border-border-subtle">
              <div className="flex flex-col gap-4">
                {/* Hero Monthly Payment */}
                <div className="flex flex-col pb-3 border-b border-border-subtle">
                  <span className="font-label-xs text-label-xs text-text-muted uppercase tracking-wider">
                    ยอดผ่อนชำระประมาณการ
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-price-xl text-3xl font-extrabold text-primary tracking-tight">
                      ฿{calculation.monthlyPayment.toLocaleString()}
                    </span>
                    <span className="font-body-sm text-body-sm text-text-muted">/ เดือน</span>
                  </div>
                </div>

                {/* Feasibility Indicator Badge */}
                {calculation.dsr <= 40 ? (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-xs leading-relaxed">
                      <span className="font-semibold text-emerald-900">
                        ความสามารถในการกู้: อยู่ในเกณฑ์ดี
                      </span>
                      <span>
                        สัดส่วนภาระหนี้ผ่อน DSR ประมาณ {calculation.dsr}% (เกณฑ์มาตรฐานไม่เกิน 40%)
                      </span>
                    </div>
                  </div>
                ) : calculation.dsr <= 60 ? (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-xs leading-relaxed">
                      <span className="font-semibold text-amber-900">
                        ความสามารถในการกู้: ปานกลาง
                      </span>
                      <span>
                        สัดส่วนภาระหนี้ผ่อน DSR อยู่ที่ {calculation.dsr}% แนะนำให้มีผู้กู้ร่วม
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col text-xs leading-relaxed">
                      <span className="font-semibold text-rose-900">
                        ภาระหนี้ค่อนข้างสูง (DSR {calculation.dsr}%)
                      </span>
                      <span>แนะนำเพิ่มเงินดาวน์หรือยื่นกู้ร่วมเพื่อให้อนุมัติง่ายขึ้น</span>
                    </div>
                  </div>
                )}

                {/* Principal & Interest Breakdown */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
                      เงินต้นต่องวด (โดยประมาณ)
                    </span>
                    <span className="font-semibold text-on-surface">
                      ฿{calculation.principalPortion.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                      ดอกเบี้ยต่องวด (โดยประมาณ)
                    </span>
                    <span className="font-semibold text-on-surface">
                      ฿{calculation.interestPortion.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress bar visually showing Principal vs Interest */}
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
                  {calculation.monthlyPayment > 0 && (
                    <>
                      <div
                        className="bg-primary h-full"
                        style={{
                          width: `${(calculation.principalPortion / calculation.monthlyPayment) * 100}%`,
                        }}
                      ></div>
                      <div
                        className="bg-amber-500 h-full"
                        style={{
                          width: `${(calculation.interestPortion / calculation.monthlyPayment) * 100}%`,
                        }}
                      ></div>
                    </>
                  )}
                </div>
              </div>

              {/* Consultation Lead Box */}
              <div className="pt-4 border-t border-border-subtle">
                {consultSubmitted ? (
                  <div className="p-3 bg-primary-light text-primary rounded-xl text-center font-label-xs text-xs font-semibold">
                    ✓ ระบบได้รับคำขอแล้ว เจ้าหน้าที่สินเชื่อจะติดต่อกลับภายใน 24 ชม.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConsultSubmitted(true)}
                    className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-on-primary font-body-sm-medium text-body-sm-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>ปรึกษาเจ้าหน้าที่สินเชื่อธนาคารพันธมิตร</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[11px] text-text-muted text-center mt-2">
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
