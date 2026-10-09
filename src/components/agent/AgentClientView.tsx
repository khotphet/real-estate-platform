'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_LISTINGS } from '@/data/mock-listings';

export interface AgentProfile {
  id: string;
  name: string;
  roleTitle: string;
  agency: string;
  licenseNo: string;
  phone: string;
  lineId: string;
  email: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  closedDeals: number;
  experienceYears: number;
  bio: string;
  zones: string[];
}

interface AgentClientViewProps {
  agent: AgentProfile;
}

export function AgentClientView({ agent }: AgentClientViewProps) {
  const [filterType, setFilterType] = useState('all');

  // Only listings posted by this agent (sold ones hidden, rule O5)
  const ownListings = MOCK_LISTINGS.filter((l) => l.poster.name === agent.name && l.status !== 'sold');
  const agentListings = ownListings.filter((l) => filterType === 'all' || l.propertyType === filterType);

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Cover & Profile Card Bento */}
        <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-xs mb-8">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-64 bg-slate-900 overflow-hidden">
            <img
              src={agent.coverImage}
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Profile Header Bar */}
          <div className="relative px-6 sm:px-10 pb-8 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                {/* Avatar */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-surface shadow-xl bg-slate-200 shrink-0">
                  <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                  <span
                    className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-status-active border-2 border-surface"
                    title="ออนไลน์พร้อมติดต่อ"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/60 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                      <span>Verified Agent Pro</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      ★ {agent.rating} ({agent.reviewsCount} รีวิว)
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-foreground">{agent.name}</h1>
                  <p className="text-xs sm:text-sm text-muted mt-0.5">{agent.agency}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">ใบอนุญาต: {agent.licenseNo}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2.5">
                <a
                  href={`tel:${agent.phone.replace(/[^0-9]/g, '')}`}
                  className="px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">phone</span>
                  <span>โทร {agent.phone}</span>
                </a>
                <Link
                  href={`/messages?to=${encodeURIComponent(agent.name)}`}
                  className="px-4 py-2.5 border border-border hover:bg-slate-50 text-foreground rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>แชทในระบบ</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 pt-6 border-t border-border">
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <div className="text-xl font-black text-foreground">{agent.closedDeals} ทรัพย์</div>
                <div className="text-[11px] text-muted">ปิดการขายสำเร็จ</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <div className="text-xl font-black text-foreground">{agent.experienceYears} ปี</div>
                <div className="text-[11px] text-muted">ประสบการณ์ในวงการ</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <div className="text-xl font-black text-primary">3.0% (50/50)</div>
                <div className="text-[11px] text-muted">เปิดรับ Co-Broker</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <div className="text-xl font-black text-foreground">{ownListings.length} ทรัพย์</div>
                <div className="text-[11px] text-muted">ประกาศที่กำลังดูแล</div>
              </div>
            </div>

            {/* Bio & Zones */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{agent.bio}</p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-bold text-foreground mr-1">ทำเลเชี่ยวชาญ:</span>
                {agent.zones.map((zone, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-background border border-border rounded-lg text-xs font-medium text-slate-700"
                  >
                    📍 {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Listings Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              ทรัพย์ทั้งหมดที่ดูแลโดย {agent.name} ({agentListings.length} รายการ)
            </h2>
            <p className="text-xs text-muted mt-0.5">
              ทรัพย์คุณภาพผ่านการตรวจสอบโฉนดและพิกัดจริงในจังหวัดอุดรธานี
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'condo', label: 'คอนโด' },
              { id: 'house', label: 'บ้านเดี่ยว' },
              { id: 'townhome', label: 'ทาวน์โฮม' },
              { id: 'land', label: 'ที่ดิน' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  filterType === f.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface border border-border text-muted hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agentListings.map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                      {item.dealType === 'sale' ? 'ขาย' : 'เช่า'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {item.code}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-lg font-black text-foreground mb-1">{item.priceFormatted}</div>
                  <h4 className="text-xs font-bold text-foreground line-clamp-1">
                    <Link href={`/listing/${item.code}`} className="hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  </h4>
                  <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{item.location.address}</p>

                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-xs text-slate-600">
                    <span>{item.specs.usableAreaSqm || item.specs.landAreaSqwa} {item.specs.usableAreaSqm ? 'ตร.ม.' : 'ตร.ว.'}</span>
                    <span className="text-primary font-semibold">รับ Co-Broker 3%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  href={`/listing/${item.code}`}
                  className="block w-full py-2 bg-primary/10 hover:bg-primary hover:text-white text-primary text-center rounded-xl text-xs font-bold transition-colors"
                >
                  ดูประกาศนี้
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Client Reviews Section */}
        <div className="bg-surface rounded-3xl border border-border p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">เสียงตอบรับจากลูกค้า (Customer Reviews)</h3>
              <p className="text-xs text-muted">จากผู้ซื้อและผู้ขายจริงในจังหวัดอุดรธานี</p>
            </div>
            <span className="text-base font-bold text-amber-500">★ 4.9 จาก 5.0</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                client: 'คุณสุชาติ (แพทย์ รพ.ศูนย์อุดรธานี)',
                comment: 'คุณสมหญิงดูแลเรื่องการยื่นกู้และเอกสารโฉนดดีมาก บ้านเดี่ยวโซนหนองประจักษ์โอนเสร็จภายใน 2 สัปดาห์ ประทับใจความเป็นมืออาชีพครับ',
                date: 'กันยายน 2026',
              },
              {
                client: 'คุณวราภรณ์ (เจ้าของธุรกิจ UD Town)',
                comment: 'หาคอนโดสำหรับปล่อยเช่า คุณสมหญิงช่วยหาผู้เช่าพร้อมทำสัญญามาตรฐานให้เสร็จสรรพ มีความรู้เรื่องทำเลอุดรธานีลึกซึ้งมากค่ะ',
                date: 'สิงหาคม 2026',
              },
            ].map((rev, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{rev.client}</span>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                <div className="text-[10px] text-muted pt-1">{rev.date}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
