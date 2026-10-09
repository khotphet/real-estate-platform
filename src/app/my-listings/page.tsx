'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Eye,
  MessageSquare,
  CheckCircle2,
  Clock,
  PlusCircle,
  ExternalLink,
  Edit3,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_LISTINGS } from '@/data/mock-listings';
import { ListingStatus } from '@/types/listing';

export default function MyListingsPage() {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'reserved' | 'sold'>('all');
  const [listings, setListings] = useState(
    // Owner somchai listings (subset of mock listings)
    MOCK_LISTINGS.filter((item, idx) => [0, 1, 2, 6, 7].includes(idx))
  );

  const filteredItems = listings.filter((item) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'active') return item.status === 'available';
    if (filterTab === 'reserved') return item.status === 'reserved';
    if (filterTab === 'sold') return item.status === 'sold';
    return true;
  });

  const updateStatus = (id: string, newStatus: ListingStatus) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const statusLabel =
            newStatus === 'available' ? 'ว่าง' : newStatus === 'reserved' ? 'ติดจอง' : 'ขายแล้ว';
          return { ...item, status: newStatus, statusLabel };
        }
        return item;
      })
    );
  };

  const activeCount = listings.filter((i) => i.status === 'available').length;
  const reservedCount = listings.filter((i) => i.status === 'reserved').length;
  const soldCount = listings.filter((i) => i.status === 'sold').length;

  return (
    <div className="min-h-screen flex flex-col bg-canvas-background">
      <Navbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">
          <Link href="/" className="hover:text-primary transition-colors">
            หน้าแรก
          </Link>
          <ChevronRight className="w-4 h-4 text-text-muted" />
          <span className="text-on-surface font-semibold">จัดการประกาศของฉัน (My Listings)</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                จัดการประกาศของฉัน
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-light text-primary text-xs font-bold border border-primary/20">
                อุดรธานี ฮับ
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">
              ดูแลประกาศอสังหาริมทรัพย์ ตรวจสอบสถิติผู้เข้าชม ปรับเปลี่ยนสถานะ และโปรโมตทรัพย์ของคุณ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/post"
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ ลงประกาศทรัพย์ใหม่</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Metrics Bento Grid (Matching S21) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Listings */}
          <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">ประกาศที่เปิดขาย/เช่า</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-on-surface">{activeCount}</span>
              <span className="text-xs text-text-muted ml-1.5">ประกาศ</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              กำลังแสดงผลบนแผนที่
            </span>
          </div>

          {/* Card 2: Total Views */}
          <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">ยอดการเข้าชมทั้งหมด</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-on-surface">3,480</span>
              <span className="text-xs text-text-muted ml-1.5">ครั้ง</span>
            </div>
            <span className="text-[11px] text-blue-600 font-semibold">
              +18% จากสัปดาห์ก่อน
            </span>
          </div>

          {/* Card 3: Chat Inquiries */}
          <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">ผู้สนใจทักแชท / นัดชม</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-on-surface">28</span>
              <span className="text-xs text-text-muted ml-1.5">ข้อความ</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">
              อัตราตอบกลับ 95% (เฉลี่ย 15 นาที)
            </span>
          </div>

          {/* Card 4: Reserved / Sold */}
          <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-muted">ติดจอง / ปิดการขายแล้ว</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-teal-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-on-surface">
                {reservedCount + soldCount}
              </span>
              <span className="text-xs text-text-muted ml-1.5">รายการ</span>
            </div>
            <span className="text-[11px] text-text-muted">
              ติดจอง {reservedCount} · ปิดการขาย {soldCount}
            </span>
          </div>
        </div>

        {/* Listings Section with Filter Tabs */}
        <div className="bg-surface-card rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
          {/* Filter Tabs Header */}
          <div className="p-4 sm:p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 bg-canvas-background p-1 rounded-xl border border-border-subtle self-start">
              {[
                { id: 'all', label: `ทั้งหมด (${listings.length})` },
                { id: 'active', label: `เปิดขาย/เช่า (${activeCount})` },
                { id: 'reserved', label: `ติดจอง (${reservedCount})` },
                { id: 'sold', label: `ปิดการขาย (${soldCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    filterTab === tab.id
                      ? 'bg-surface-card text-primary shadow-xs'
                      : 'text-text-muted hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-text-muted">
              แสดงผล {filteredItems.length} รายการ
            </span>
          </div>

          {/* Listings List */}
          <div className="divide-y divide-border-subtle">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="relative w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-border-subtle">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                      {item.code}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {item.status === 'available' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold flex items-center gap-1 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          เปิดขาย/เช่า (Active)
                        </span>
                      ) : item.status === 'reserved' ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold flex items-center gap-1 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-500" />
                          ติดจอง (Reserved)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-semibold border border-rose-200">
                          ขายแล้ว (Sold Out)
                        </span>
                      )}

                      <span className="text-xs text-text-muted">
                        {item.dealType === 'sale' ? 'ขาย' : 'ให้เช่า'}
                      </span>
                    </div>

                    <h3 className="font-bold text-on-surface text-sm sm:text-base line-clamp-1">
                      <Link href={`/listing/${item.code}`} className="hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{item.location.subdistrict}, อุดรธานี</span>
                      <span>·</span>
                      <span className="font-bold text-primary text-sm font-price">
                        {item.priceFormatted}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Status Switcher & Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end md:self-center">
                  {/* Status Toggle Menu */}
                  <div className="flex items-center p-1 bg-canvas-background rounded-xl border border-border-subtle text-xs">
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'available')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        item.status === 'available'
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'text-text-muted hover:text-on-surface'
                      }`}
                    >
                      ว่าง
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'reserved')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        item.status === 'reserved'
                          ? 'bg-amber-500 text-white font-semibold shadow-xs'
                          : 'text-text-muted hover:text-on-surface'
                      }`}
                    >
                      ติดจอง
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'sold')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        item.status === 'sold'
                          ? 'bg-rose-600 text-white font-semibold shadow-xs'
                          : 'text-text-muted hover:text-on-surface'
                      }`}
                    >
                      ขายแล้ว
                    </button>
                  </div>

                  {/* View on web */}
                  <Link
                    href={`/listing/${item.code}`}
                    className="p-2 bg-surface-card hover:bg-slate-100 text-text-muted hover:text-primary rounded-xl border border-border-subtle transition-colors"
                    title="เปิดดูประกาศบนเว็บ"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Boost CTA */}
                  <button
                    type="button"
                    onClick={() => alert(`เริ่มโปรโมทดันประกาศ ${item.code} ขึ้นบนสุด 7 วัน!`)}
                    className="px-3 py-1.5 bg-primary-light hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ดันประกาศ (Boost)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
