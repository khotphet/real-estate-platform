'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_LISTINGS } from '@/data/mock-listings';
import { Listing } from '@/types/listing';

interface WaitlistItem {
  id: string;
  listingCode: string;
  listing: Listing;
  queueNumber: number;
  joinedDate: string;
  expiresIn: string;
  status: 'waiting' | 'offered' | 'expired';
}

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<'saved' | 'waitlist'>('saved');

  // Initial saved listings (UD-00101, UD-00102, UD-00104)
  const [savedCodes, setSavedCodes] = useState<string[]>(['UD-00101', 'UD-00102', 'UD-00104']);

  // Initial waitlist item (UD-00103)
  const reservedListing = MOCK_LISTINGS.find((l) => l.code === 'UD-00103') || MOCK_LISTINGS[2];
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([
    {
      id: 'wl-1',
      listingCode: 'UD-00103',
      listing: reservedListing,
      queueNumber: 2,
      joinedDate: '7 ต.ค. 2026',
      expiresIn: 'อีก 5 วัน (14 ต.ค. 2026)',
      status: 'waiting',
    },
  ]);

  const savedListings = savedCodes
    .map((code) => MOCK_LISTINGS.find((l) => l.code === code))
    .filter((l): l is Listing => Boolean(l));

  const handleRemoveSaved = (code: string) => {
    setSavedCodes((prev) => prev.filter((c) => c !== code));
  };

  const handleCancelWaitlist = (id: string) => {
    setWaitlist((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted mb-1">
              <Link href="/" className="hover:text-primary transition-colors">หน้าแรก</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">บันทึกและคิวจอง</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              ทรัพย์ที่บันทึกไว้ & คิวจองสำรอง (S12)
            </h1>
            <p className="text-sm text-muted mt-1">
              ติดตามทรัพย์ที่คุณสนใจและจัดการคิวจองสำรองในจังหวัดอุดรธานี
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/compare"
              className="px-4 py-2 bg-surface border border-border text-foreground rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">compare_arrows</span>
              <span>ไปที่หน้าเปรียบเทียบ</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 border-b border-border pb-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">favorite</span>
            <span>ทรัพย์ที่บันทึกไว้ ({savedListings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('waitlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'waitlist'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
            <span>คิวจองสำรองของฉัน ({waitlist.length})</span>
          </button>
        </div>

        {/* Tab 1: Saved Listings */}
        {activeTab === 'saved' && (
          <div>
            {savedListings.length === 0 ? (
              <div className="bg-surface rounded-2xl border border-border p-12 text-center shadow-xs">
                <span className="material-symbols-outlined text-5xl text-muted">favorite_border</span>
                <h3 className="text-lg font-bold text-foreground mt-3">ยังไม่มีทรัพย์ที่บันทึกไว้</h3>
                <p className="text-sm text-muted mt-1">
                  คลิกไอคอนหัวใจที่ประกาศที่คุณสนใจเพื่อเก็บไว้ดูภายหลัง
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <span>สำรวจทรัพย์บนแผนที่</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedListings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSaved(item.code)}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-red-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                          title="นำออกจากบันทึก"
                        >
                          <span className="material-symbols-outlined text-[18px]">favorite</span>
                        </button>

                        <div className="absolute top-2.5 left-2.5 flex gap-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                            {item.dealType === 'sale' ? 'ขาย' : 'เช่า'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                            {item.code}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-black text-foreground">{item.priceFormatted}</span>
                          <span className="text-xs text-muted">ต.{item.location.subdistrict}</span>
                        </div>

                        <h4 className="text-xs font-bold text-foreground line-clamp-1">
                          <Link href={`/listing/${item.code}`} className="hover:text-primary transition-colors">
                            {item.title}
                          </Link>
                        </h4>
                        <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{item.location.address}</p>

                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-border">
                          <span>{item.specs.bedrooms ?? '—'} นอน</span>
                          <span>•</span>
                          <span>{item.specs.bathrooms ?? '—'} น้ำ</span>
                          <span>•</span>
                          <span>{item.specs.usableAreaSqm || item.specs.landAreaSqwa} {item.specs.usableAreaSqm ? 'ตร.ม.' : 'ตร.ว.'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 flex gap-2">
                      <Link
                        href={`/listing/${item.code}`}
                        className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all text-center shadow-xs"
                      >
                        ดูรายละเอียด
                      </Link>
                      <Link
                        href={`/compare?codes=${item.code},UD-00101,UD-00102`}
                        className="px-3 py-2 border border-border hover:bg-slate-50 text-foreground rounded-xl text-xs font-bold flex items-center justify-center transition-colors"
                        title="เปรียบเทียบ"
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">compare_arrows</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Waitlist Queues */}
        {activeTab === 'waitlist' && (
          <div>
            {waitlist.length === 0 ? (
              <div className="bg-surface rounded-2xl border border-border p-12 text-center shadow-xs">
                <span className="material-symbols-outlined text-5xl text-muted">hourglass_empty</span>
                <h3 className="text-lg font-bold text-foreground mt-3">ไม่มีคิวจองสำรองที่กำลังรอ</h3>
                <p className="text-sm text-muted mt-1">
                  เมื่อคุณพบทรัพย์ที่ติดจอง คุณสามารถกดปุ่ม "ต่อคิวสำรอง" เพื่อรักษาสิทธิ์ได้
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {waitlist.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface rounded-2xl border border-border p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <img
                        src={item.listing.images[0]}
                        alt={item.listing.title}
                        className="w-24 h-24 rounded-xl object-cover bg-slate-100 shrink-0"
                      />

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-status-reserved/10 text-status-reserved">
                            ทรัพย์ติดจอง
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                            คิวลำดับที่ #{item.queueNumber}
                          </span>
                          <span className="text-xs text-muted">รหัส: {item.listingCode}</span>
                        </div>

                        <h3 className="text-sm font-bold text-foreground line-clamp-1">
                          <Link href={`/listing/${item.listingCode}`} className="hover:text-primary transition-colors">
                            {item.listing.title}
                          </Link>
                        </h3>

                        <div className="text-sm font-black text-primary mt-0.5">
                          {item.listing.priceFormatted}
                        </div>

                        <div className="text-xs text-muted mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span>วันที่เข้าคิว: {item.joinedDate}</span>
                          <span>สิทธิ์คุ้มครองถึง: <span className="font-semibold text-foreground">{item.expiresIn}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Waitlist Status & Cancel */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border">
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800 text-left sm:text-right w-full sm:w-auto">
                        <div className="font-bold flex items-center gap-1 sm:justify-end">
                          <span className="material-symbols-outlined text-[15px]">info</span>
                          <span>กฎ Blueprint O10</span>
                        </div>
                        <div>หากผู้จองหลักสละสิทธิ์ ระบบจะแจ้งเตือนคุณผ่าน SMS และแชททันที</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCancelWaitlist(item.id)}
                        className="w-full sm:w-auto px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        สละสิทธิ์คิว
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
