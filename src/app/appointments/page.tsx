'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { MOCK_LISTINGS } from '@/data/mock-listings';

interface Appointment {
  id: string;
  listingCode: string;
  listingTitle: string;
  listingImage: string;
  address: string;
  date: string;
  time: string;
  hostName: string;
  hostRole: string;
  hostPhone: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  note?: string;
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      listingCode: 'UD-00101',
      listingTitle: 'ลุมพินี เพลส ยูดี-โพศรี (Lumpini Place UD-Phosri)',
      listingImage: MOCK_LISTINGS[0].images[0],
      address: 'ถ.โพศรี ต.หมากแข้ง อ.เมืองอุดรธานี (ใกล้ UD Town)',
      date: '12 ต.ค. 2026',
      time: '10:30 น.',
      hostName: 'คุณสมหญิง บุญรักษา',
      hostRole: 'เอเจนต์ผู้ดูแลโครงการ',
      hostPhone: '081-882-9901',
      status: 'confirmed',
      note: 'นัดพบบริเวณล็อบบี้ อาคาร B เจ้าหน้าที่นิติคอนโดเตรียมคีย์การ์ดไว้แล้ว',
    },
    {
      id: 'apt-2',
      listingCode: 'UD-00102',
      listingTitle: 'บ้านเดี่ยว ศุภาลัย การ์เด้นวิลล์ อุดรธานี',
      listingImage: MOCK_LISTINGS[1].images[0],
      address: 'ถ.มิตรภาพ ต.บ้านจั่น อ.เมืองอุดรธานี',
      date: '15 ต.ค. 2026',
      time: '14:00 น.',
      hostName: 'คุณสมชาย ยิ่งเจริญ',
      hostRole: 'เจ้าของบ้าน',
      hostPhone: '089-123-4567',
      status: 'pending',
      note: 'รอเจ้าของยืนยันความพร้อมเข้าชมรอบบ่าย',
    },
    {
      id: 'apt-3',
      listingCode: 'UD-00104',
      listingTitle: 'ทาวน์โฮม สิริ เพลส อุดรธานี',
      listingImage: MOCK_LISTINGS[3].images[0],
      address: 'ถ.รอบเมือง ต.หนองบัว อ.เมืองอุดรธานี',
      date: '2 ต.ค. 2026',
      time: '11:00 น.',
      hostName: 'คุณวราภรณ์ สิทธิโชค',
      hostRole: 'ตัวแทนนายหน้า',
      hostPhone: '084-555-7890',
      status: 'completed',
    },
  ]);

  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const upcomingList = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending');
  const pastList = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

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
              <span className="text-foreground font-semibold">นัดหมายชมทรัพย์</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              ตารางนัดหมายชมทรัพย์ (S19 My Appointments)
            </h1>
            <p className="text-sm text-muted mt-1">
              ติดตามวันเวลานัดเข้าชมบ้าน คอนโด หรือที่ดินจริงในจังหวัดอุดรธานี
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
            <span>ค้นหาทรัพย์เพื่อนัดชมเพิ่ม</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
          <button
            type="button"
            onClick={() => setTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'upcoming'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">event_available</span>
            <span>นัดหมายที่กำลังมาถึง ({upcomingList.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('past')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              tab === 'past'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>ประวัตินัดหมายที่ผ่านมา ({pastList.length})</span>
          </button>
        </div>

        {/* List of Appointments */}
        <div className="space-y-4">
          {(tab === 'upcoming' ? upcomingList : pastList).map((item) => (
            <div
              key={item.id}
              className="bg-surface rounded-2xl border border-border p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Left Column: Date & Property */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Date Pill Box */}
                <div className="p-3.5 bg-teal-50 border border-teal-100 rounded-2xl text-center shrink-0 min-w-[100px]">
                  <span className="text-[11px] font-bold text-teal-700 block uppercase">วันนัดชม</span>
                  <div className="text-sm font-black text-foreground mt-0.5">{item.date}</div>
                  <div className="text-xs font-bold text-primary mt-0.5">{item.time}</div>
                </div>

                {/* Property Details */}
                <div className="flex items-start gap-3">
                  <img
                    src={item.listingImage}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black text-white">
                        {item.listingCode}
                      </span>
                      {item.status === 'confirmed' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-status-active/10 text-status-active flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>ยืนยันนัดหมายแล้ว</span>
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>รอเจ้าของยืนยัน</span>
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          เข้าชมเรียบร้อยแล้ว
                        </span>
                      )}
                      {item.status === 'cancelled' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
                          ยกเลิกแล้ว
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-foreground">
                      <Link href={`/listing/${item.listingCode}`} className="hover:text-primary transition-colors">
                        {item.listingTitle}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted mt-0.5">{item.address}</p>

                    {item.note && (
                      <p className="text-[11px] text-teal-800 bg-teal-50/60 px-2.5 py-1 rounded-lg mt-2 inline-block">
                        💬 หมายเหตุ: {item.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Person & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
                {/* Host Info */}
                <div className="text-left sm:text-right">
                  <div className="text-xs font-bold text-foreground">{item.hostName}</div>
                  <div className="text-[11px] text-muted">{item.hostRole}</div>
                  <div className="text-xs font-bold text-primary mt-0.5">โทร {item.hostPhone}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(item.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-border hover:bg-slate-50 text-foreground rounded-xl text-xs font-semibold flex items-center justify-center transition-colors"
                    title="เปิดแผนที่นำทาง Google Maps"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">directions</span>
                  </a>
                  <Link
                    href={`/messages?to=${encodeURIComponent(item.hostName)}&code=${item.listingCode}`}
                    className="p-2 border border-border hover:bg-slate-50 text-foreground rounded-xl text-xs font-semibold flex items-center justify-center transition-colors"
                    title="แชทติดต่อ"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </Link>

                  {item.status !== 'cancelled' && item.status !== 'completed' && (
                    cancelingId === item.id ? (
                      <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
                        <span className="text-[11px] text-red-700 font-medium px-2">ยืนยันยกเลิก?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAppointments((prev) =>
                              prev.map((a) => (a.id === item.id ? { ...a, status: 'cancelled' } : a))
                            );
                            setCancelingId(null);
                          }}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          ยืนยัน
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancelingId(null)}
                          className="px-2 py-1 text-slate-600 hover:text-foreground text-xs font-medium cursor-pointer"
                        >
                          ปิด
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCancelingId(item.id)}
                        className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        ยกเลิกนัด
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {(tab === 'upcoming' ? upcomingList : pastList).length === 0 && (
            <div className="bg-surface rounded-2xl border border-border p-12 text-center shadow-xs">
              <span className="material-symbols-outlined text-5xl text-muted">event_busy</span>
              <h3 className="text-lg font-bold text-foreground mt-3">ไม่มีรายการนัดหมายในหมวดนี้</h3>
              <p className="text-sm text-muted mt-1">คุณสามารถเลือกดูประกาศและกดปุ่ม "นัดหมายชมทรัพย์" เพื่อกำหนดวันเวลาได้</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
