'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_LISTINGS } from '@/data/mock-listings';
import { Listing } from '@/types/listing';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialCodesParam = searchParams.get('codes');

  // Initialize selected listings from query param or default 3 listings
  const initialCodes = initialCodesParam
    ? initialCodesParam.split(',').filter(Boolean)
    : ['UD-00101', 'UD-00102', 'UD-00104'];

  const [selectedCodes, setSelectedCodes] = useState<string[]>(initialCodes);
  const [showAddModal, setShowAddModal] = useState(false);

  // Selected Listing Objects
  const selectedListings = selectedCodes
    .map((code) => MOCK_LISTINGS.find((l) => l.code === code))
    .filter((l): l is Listing => Boolean(l));

  // Available listings to add (not yet in comparison)
  const availableListings = MOCK_LISTINGS.filter(
    (l) => !selectedCodes.includes(l.code)
  );

  const handleRemove = (code: string) => {
    setSelectedCodes((prev) => prev.filter((c) => c !== code));
  };

  const handleAdd = (code: string) => {
    if (selectedCodes.length >= 4) return;
    setSelectedCodes((prev) => [...prev, code]);
    setShowAddModal(false);
  };

  // Common amenities to compare
  const ALL_AMENITIES = [
    'สระว่ายน้ำระบบเกลือ',
    'ห้องฟิตเนสวิวสวน',
    'รปภ. ดูแล 24 ชม.',
    'กล้องวงจรปิด CCTV',
    'สวนพักผ่อนส่วนกลาง',
    'ที่จอดรถในร่ม',
    'ระบบคีย์การ์ดสแกน',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted mb-1">
              <Link href="/" className="hover:text-primary transition-colors">หน้าแรก</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">เปรียบเทียบทรัพย์</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              เปรียบเทียบรายละเอียดทรัพย์ ({selectedListings.length}/4)
            </h1>
            <p className="text-sm text-muted mt-1">
              วิเคราะห์ราคา สเปกพื้นที่ และทำเลเทียบเคียงในจังหวัดอุดรธานี
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedCodes.length < 4 && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>เพิ่มทรัพย์เปรียบเทียบ</span>
              </button>
            )}
            <Link
              href="/"
              className="px-3.5 py-2 bg-surface border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">map</span>
              <span>กลับสู่แผนที่</span>
            </Link>
          </div>
        </div>

        {/* Comparison Table / Matrix */}
        {selectedListings.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-muted">compare_arrows</span>
            <h3 className="text-lg font-bold text-foreground mt-3">ยังไม่มีทรัพย์ในตารางเปรียบเทียบ</h3>
            <p className="text-sm text-muted mt-1">เลือกทรัพย์จากรายการเพื่อเริ่มเปรียบเทียบ</p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 cursor-pointer"
            >
              เลือกทรัพย์เปรียบเทียบ
            </button>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[920px]">
                {/* Property Card Header Row */}
                <thead>
                  <tr className="border-b border-border bg-slate-50/60">
                    <th className="w-[18%] min-w-[150px] p-4 text-xs font-bold text-muted uppercase tracking-wider align-top">
                      คุณสมบัติ / ทรัพย์
                    </th>
                    {selectedListings.map((item) => (
                      <th key={item.id} className="min-w-[200px] p-4 align-top">
                        <div className="relative group">
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemove(item.code)}
                            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="นำออกจากการเปรียบเทียบ"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>

                          {/* Image */}
                          <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 mb-3">
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-2 left-2 flex gap-1">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                                {item.dealType === 'sale' ? 'ขาย' : 'เช่า'}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                                {item.code}
                              </span>
                            </div>
                          </div>

                          {/* Title & Price */}
                          <div className="text-lg font-black text-foreground">
                            {item.priceFormatted}
                          </div>
                          <Link
                            href={`/listing/${item.code}`}
                            className="text-xs font-bold text-slate-800 hover:text-primary line-clamp-2 mt-1"
                          >
                            {item.title}
                          </Link>
                          <div className="text-[11px] text-muted line-clamp-1 mt-0.5">
                            {item.location.address}
                          </div>

                          {/* CTA Link */}
                          <div className="mt-3 flex gap-2">
                            <Link
                              href={`/listing/${item.code}`}
                              className="flex-1 py-1.5 bg-primary/10 hover:bg-primary hover:text-white text-primary text-center rounded-lg text-xs font-bold transition-colors"
                            >
                              ดูประกาศ
                            </Link>
                            <Link
                              href={`/messages?to=${encodeURIComponent(item.poster.name)}&code=${item.code}`}
                              className="px-2.5 py-1.5 border border-border hover:bg-slate-50 text-foreground rounded-lg text-xs font-bold flex items-center justify-center"
                              title="แชทติดต่อ"
                            >
                              <span className="material-symbols-outlined text-[16px]">chat</span>
                            </Link>
                          </div>
                        </div>
                      </th>
                    ))}
                    {selectedListings.length < 4 && (
                      <th className="min-w-[200px] p-4 align-middle text-center bg-slate-50/30">
                        <button
                          type="button"
                          onClick={() => setShowAddModal(true)}
                          className="w-full h-48 border-2 border-dashed border-border hover:border-primary rounded-xl flex flex-col items-center justify-center gap-2 text-muted hover:text-primary transition-colors cursor-pointer group"
                        >
                          <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">
                            add_circle_outline
                          </span>
                          <span className="text-xs font-bold">เพิ่มทรัพย์อีก 1 รายการ</span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border text-sm">
                  {/* Category: ข้อมูลพื้นฐาน */}
                  <tr className="bg-slate-100/70">
                    <td colSpan={selectedListings.length + (selectedListings.length < 4 ? 2 : 1)} className="px-4 py-2 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      1. ข้อมูลพื้นฐานและราคา
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">ประเภททรัพย์</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-bold text-foreground capitalize">
                        {item.propertyType}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">ราคาต่อ ตร.ม. / ตร.ว.</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-bold text-primary">
                        {item.pricePerSqm ? `฿${item.pricePerSqm.toLocaleString()} / ตร.ม.` : '—'}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">สถานะ</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                            item.status === 'available'
                              ? 'bg-status-active/10 text-status-active'
                              : 'bg-status-reserved/10 text-status-reserved'
                          }`}
                        >
                          {item.statusLabel}
                        </span>
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>

                  {/* Category: สเปกและพื้นที่ */}
                  <tr className="bg-slate-100/70">
                    <td colSpan={selectedListings.length + (selectedListings.length < 4 ? 2 : 1)} className="px-4 py-2 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      2. สเปกพื้นที่และฟังก์ชัน
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">พื้นที่ใช้สอย</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-medium text-foreground">
                        {item.specs.usableAreaSqm ? `${item.specs.usableAreaSqm} ตร.ม.` : '—'}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">ขนาดที่ดิน</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-medium text-foreground">
                        {item.specs.landAreaSqwa ? `${item.specs.landAreaSqwa} ตร.ว.` : '—'}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">ห้องนอน / ห้องน้ำ</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-medium text-foreground">
                        {item.specs.bedrooms ?? '—'} นอน / {item.specs.bathrooms ?? '—'} น้ำ
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">ที่จอดรถ</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-medium text-foreground">
                        {item.specs.parking ? `${item.specs.parking} คัน` : '—'}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">ทิศระเบียง / หน้าบ้าน</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-medium text-foreground">
                        {item.specs.direction || 'ไม่ระบุ'}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">สภาพเฟอร์นิเจอร์</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-medium text-foreground">
                        {item.specs.furnishedStatus || 'ไม่มี'}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>

                  {/* Category: ทำเลและสถานที่ใกล้เคียง */}
                  <tr className="bg-slate-100/70">
                    <td colSpan={selectedListings.length + (selectedListings.length < 4 ? 2 : 1)} className="px-4 py-2 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      3. ทำเลและระยะทาง
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">ตำบล / อำเภอ</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 font-medium text-foreground">
                        ต.{item.location.subdistrict} อ.{item.location.district}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-muted text-xs">แลนด์มาร์กสำคัญ</td>
                    {selectedListings.map((item) => (
                      <td key={item.id} className="p-4 text-xs text-foreground">
                        {item.location.nearLandmark || 'ใจกลางเมืองอุดรฯ'}
                      </td>
                    ))}
                    {selectedListings.length < 4 && <td></td>}
                  </tr>

                  {/* Category: สิ่งอำนวยความสะดวก */}
                  <tr className="bg-slate-100/70">
                    <td colSpan={selectedListings.length + (selectedListings.length < 4 ? 2 : 1)} className="px-4 py-2 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      4. สิ่งอำนวยความสะดวกส่วนกลาง
                    </td>
                  </tr>
                  {ALL_AMENITIES.map((facility) => (
                    <tr key={facility}>
                      <td className="p-4 font-semibold text-muted text-xs">{facility}</td>
                      {selectedListings.map((item) => {
                        const hasAmenity = item.amenities?.some((a) => a.name.includes(facility.slice(0, 4)));
                        return (
                          <td key={item.id} className="p-4">
                            {hasAmenity ? (
                              <span className="material-symbols-outlined text-status-active text-[20px]">
                                check_circle
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-slate-300 text-[20px]">
                                remove
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {selectedListings.length < 4 && <td></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal to Select Listing to Add */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-surface rounded-2xl border border-border p-6 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">เลือกทรัพย์เพื่อเปรียบเทียบ</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-muted"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {availableListings.length === 0 ? (
                  <p className="text-center text-sm text-muted py-6">เลือกทรัพย์ครบทุกรายการแล้ว</p>
                ) : (
                  availableListings.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAdd(item.code)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-primary">{item.priceFormatted}</span>
                          <span className="text-[10px] text-muted">({item.code})</span>
                        </div>
                        <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-muted truncate">{item.location.address}</p>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[20px] group-hover:scale-110 transition-transform">
                        add_circle
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted">
            <span className="material-symbols-outlined text-3xl animate-spin text-primary">
              progress_activity
            </span>
            <span className="text-sm font-semibold">กำลังโหลดข้อมูลเปรียบเทียบ...</span>
          </div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
