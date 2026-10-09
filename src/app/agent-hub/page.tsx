'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_LISTINGS } from '@/data/mock-listings';
import { Listing } from '@/types/listing';

export default function AgentHubPage() {
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  const [filterType, setFilterType] = useState('all');

  // Co-broking listings (filter for sale items with commission calculation)
  const coBrokerListings = MOCK_LISTINGS.filter((l) => l.dealType === 'sale').filter((l) => {
    if (filterType === 'all') return true;
    return l.propertyType === filterType;
  });

  const handleOpenContract = (item: Listing) => {
    setSelectedProperty(item);
    setShowContractModal(true);
    setContractSigned(false);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent Hub Top Hero */}
        <div className="relative rounded-3xl bg-linear-to-br from-slate-900 via-teal-950 to-primary text-white p-6 sm:p-10 shadow-xl overflow-hidden mb-8">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md mb-3 text-teal-300 border border-teal-500/20">
              <span className="material-symbols-outlined text-[16px]">handshake</span>
              <span>S33 Agent Hub — B2B Co-Broking Network</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              ศูนย์กลางโคโบรกเกอร์อุดรธานี (Co-Broker Hub)
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              เครือข่ายความร่วมมือนายหน้าอสังหาริมทรัพย์มืออาชีพ จับคู่ผู้ซื้อกับทรัพย์เปิดรับ Co-Broker แบ่งค่าคอมมิชชั่น 50/50 อย่างโปร่งใส พร้อมสัญญาดิจิทัลคุ้มครองลูกค้า 60 วัน
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-200">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                <span className="material-symbols-outlined text-[18px] text-teal-400">verified</span>
                <span>นายหน้าผ่านการยืนยันตัวตน (KYC Verified)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
                <span className="material-symbols-outlined text-[18px] text-teal-400">gavel</span>
                <span>สัญญาดิจิทัลรองรับกฎหมาย</span>
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-[260px] text-white">groups_3</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface rounded-2xl border border-border p-4 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                filterType === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background border border-border text-muted hover:text-foreground'
              }`}
            >
              ทรัพย์โคโบรกทั้งหมด ({coBrokerListings.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('condo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                filterType === 'condo'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background border border-border text-muted hover:text-foreground'
              }`}
            >
              คอนโดมิเนียม
            </button>
            <button
              type="button"
              onClick={() => setFilterType('detached_house')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                filterType === 'detached_house'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background border border-border text-muted hover:text-foreground'
              }`}
            >
              บ้านเดี่ยว
            </button>
            <button
              type="button"
              onClick={() => setFilterType('commercial')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                filterType === 'commercial'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-background border border-border text-muted hover:text-foreground'
              }`}
            >
              อาคารพาณิชย์
            </button>
          </div>

          <div className="text-xs text-muted">
            มาตรฐานค่าคอมมิชชั่น <span className="font-bold text-primary">3.0%</span> (แบ่งคนละครึ่ง 1.5% : 1.5%)
          </div>
        </div>

        {/* Co-Broker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coBrokerListings.map((item) => {
            const totalComm = Math.round(item.price * 0.03);
            const myShare = Math.round(totalComm * 0.5);

            return (
              <div
                key={item.id}
                className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-teal-800/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                        <span className="material-symbols-outlined text-[14px]">handshake</span>
                        <span>รับ Co-Broker 3%</span>
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-black/70 text-white backdrop-blur-xs">
                        {item.code}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-lg font-black text-foreground">
                        {item.priceFormatted}
                      </span>
                      <span className="text-xs font-medium text-muted">
                        ต.{item.location.subdistrict}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-foreground line-clamp-1">
                      <Link href={`/listing/${item.code}`} className="hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                    </h4>

                    {/* Co-Broker Commission Box */}
                    <div className="mt-3 p-3 bg-teal-50/80 border border-teal-100 rounded-xl">
                      <div className="flex items-center justify-between text-xs font-semibold text-teal-900 mb-1">
                        <span>ค่าคอมฯ รวม (3%):</span>
                        <span className="font-bold">฿{totalComm.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-black text-primary pt-1 border-t border-teal-200/60">
                        <span>ส่วนแบ่งฝั่งนายหน้าผู้ซื้อ (50%):</span>
                        <span className="text-sm">฿{myShare.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Agent In Charge */}
                    <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[11px]">
                          สม
                        </div>
                        <div>
                          <div className="font-bold text-foreground">คุณสมหญิง (เอเจนต์ผู้ดูแล)</div>
                          <div className="text-[10px] text-muted">Udon Top Real Estate</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-bold text-slate-700">
                        Verified ★ 4.9
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenContract(item)}
                    className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_document</span>
                    <span>ขอสัญญาโคโบรก</span>
                  </button>
                  <Link
                    href={`/messages`}
                    className="px-3 py-2 border border-border hover:bg-slate-50 text-foreground rounded-xl text-xs font-bold flex items-center justify-center transition-colors"
                    title="แชทติดต่อเอเจนต์ผู้ดูแล"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* S34 Digital Co-Broker Agreement Modal */}
        {showContractModal && selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-surface rounded-3xl border border-border p-6 max-w-xl w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">handshake</span>
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      บันทึกข้อตกลงร่วมงานโคโบรกเกอร์ (Co-Broker MOU)
                    </h3>
                    <p className="text-xs text-muted">รหัสทรัพย์: {selectedProperty.code}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowContractModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-muted cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {contractSigned ? (
                <div className="py-8 text-center">
                  <span className="material-symbols-outlined text-5xl text-status-active animate-bounce">
                    verified
                  </span>
                  <h4 className="text-lg font-bold text-foreground mt-3">
                    ลงนามสัญญาโคโบรกเกอร์สำเร็จ!
                  </h4>
                  <p className="text-xs text-muted mt-1 max-w-md mx-auto">
                    เอกสารสัญญา Co-Broker MOU รหัส MOU-UD-2026-09 ถูกส่งไปยังอีเมลของคุณและคู่สัญญาเรียบร้อย พร้อมคุ้มครองสิทธิ์ลูกค้าของคุณเป็นเวลา 60 วัน
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowContractModal(false)}
                    className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 cursor-pointer"
                  >
                    เรียบร้อย
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  {/* Property Info Brief */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex gap-3 items-center">
                    <img
                      src={selectedProperty.images[0]}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-foreground">{selectedProperty.title}</div>
                      <div className="text-xs font-black text-primary mt-0.5">
                        {selectedProperty.priceFormatted}
                      </div>
                      <div className="text-[11px] text-muted">
                        ค่าคอมมิชชั่นฝั่งผู้ซื้อ 50%: ฿{Math.round(selectedProperty.price * 0.03 * 0.5).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Contract Clauses */}
                  <div className="p-4 bg-background border border-border rounded-xl text-xs space-y-2 text-slate-700 max-h-48 overflow-y-auto leading-relaxed">
                    <div className="font-bold text-foreground">เงื่อนไขสัญญามาตรฐาน MapNest Co-Broker:</div>
                    <p>
                      1. <span className="font-semibold">การแบ่งสัดส่วนค่าธรรมเนียม:</span> คู่สัญญาทั้งสองฝ่ายตกลงแบ่งค่าบำเหน็จนายหน้า 3% ในอัตราส่วน 50% ต่อ 50% เมื่อการซื้อขายและโอนกรรมสิทธิ์เสร็จสิ้นสมบูรณ์ ณ กรมที่ดิน
                    </p>
                    <p>
                      2. <span className="font-semibold">การคุ้มครองชื่อผู้ซื้อ (Client Lock Protection):</span> ผู้ประสานงานฝั่งนายหน้าผู้ซื้อจะได้รับความคุ้มครองสิทธิ์ในตัวลูกค้าที่นำเสนอ เป็นเวลา 60 วัน นับจากวันลงนาม
                    </p>
                    <p>
                      3. <span className="font-semibold">จรรยาบรรณวิชาชีพ:</span> ห้ามนายหน้าฝั่งผู้ขายติดต่อลูกค้าของผู้ร่วมงานโดยตรงโดยไม่ได้รับความยินยอม
                    </p>
                  </div>

                  {/* Digital Signature Confirmation */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="accept-mou"
                      defaultChecked
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="accept-mou" className="text-xs font-medium text-slate-700">
                      ข้าพเจ้าเข้าใจและยอมรับข้อตกลงความร่วมมือนายหน้าดิจิทัล
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowContractModal(false)}
                      className="px-4 py-2 border border-border rounded-xl text-xs font-bold text-muted hover:bg-slate-50 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={() => setContractSigned(true)}
                      className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">draw</span>
                      <span>ยืนยันลงนามดิจิทัล MOU</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
