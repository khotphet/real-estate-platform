'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function RoleSelectionPage() {
  const router = useRouter();
  const { user, switchRole } = useAuth();
  const activeRole = user?.role || 'owner';

  const handleSelect = (role: 'owner' | 'agent' | 'buyer', destination: string) => {
    switchRole(role);
    router.push(destination);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-3 inline-block">
            S03 Role Selection — ปรับเปลี่ยนประสบการณ์ตามบทบาท
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            เลือกบทบาทของคุณใน MapNest
          </h1>
          <p className="text-sm text-muted mt-2">
            ระบบจะปรับแต่งแถบเมนู เครื่องมือ และสิทธิ์การใช้งานให้ตรงกับเป้าหมายของคุณมากที่สุด
          </p>
        </div>

        {/* 3 Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Owner */}
          <div
            onClick={() => handleSelect('owner', '/my-listings')}
            className={`rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer group ${
              activeRole === 'owner'
                ? 'border-primary bg-surface shadow-xl ring-2 ring-primary/20 scale-102'
                : 'border-border bg-surface shadow-xs hover:border-primary/50 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">home</span>
              </div>

              {activeRole === 'owner' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white mb-2 inline-block">
                  บทบาทปัจจุบัน
                </span>
              )}

              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                เจ้าของทรัพย์ (Owner)
              </h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                เหมาะสำหรับเจ้าของบ้าน คอนโด หรือที่ดินในอุดรธานี ที่ต้องการลงประกาศขายหรือปล่อยเช่าด้วยตนเอง
              </p>

              <div className="space-y-2.5 my-6 pt-6 border-t border-border text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>ลงประกาศฟรี พร้อมปักหมุดพิกัด</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>แดชบอร์ดสลับสถานะ ว่าง/ติดจอง/ขายแล้ว</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>ระบบคิวจองสำรอง (Waitlist) คุ้มครองผู้ซื้อ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>บูสต์ประกาศ & ซื้อหมุดทองคำบนแผนที่</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'owner'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-slate-100 hover:bg-primary hover:text-white text-slate-800'
              }`}
            >
              <span>{activeRole === 'owner' ? 'กำลังใช้งานอยู่' : 'เลือกบทบาทเจ้าของทรัพย์'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Card 2: Agent */}
          <div
            onClick={() => handleSelect('agent', '/agent-hub')}
            className={`rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer group ${
              activeRole === 'agent'
                ? 'border-primary bg-surface shadow-xl ring-2 ring-primary/20 scale-102'
                : 'border-border bg-surface shadow-xs hover:border-primary/50 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">badge</span>
              </div>

              {activeRole === 'agent' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white mb-2 inline-block">
                  บทบาทปัจจุบัน
                </span>
              )}

              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                นายหน้าอสังหาฯ (Agent Pro)
              </h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                เหมาะสำหรับตัวแทนนายหน้ามืออาชีพ หรือเอเจนต์อิสระที่ต้องการขยายเครือข่ายและหาดีลในอุดรธานี
              </p>

              <div className="space-y-2.5 my-6 pt-6 border-t border-border text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>ศูนย์กลาง Co-Broker Hub แบ่งคอมฯ 50/50</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>สัญญา MOU ดิจิทัลคุ้มครองลูกค้า 60 วัน</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>ยื่นข้อเสนอตรงผ่านกระดานความต้องการ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>ไมโครไซต์ส่วนตัวพร้อมป้าย Verified Pro</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'agent'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-slate-100 hover:bg-primary hover:text-white text-slate-800'
              }`}
            >
              <span>{activeRole === 'agent' ? 'กำลังใช้งานอยู่' : 'เลือกบทบาทนายหน้า'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Card 3: Buyer */}
          <div
            onClick={() => handleSelect('buyer', '/')}
            className={`rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer group ${
              activeRole === 'buyer'
                ? 'border-primary bg-surface shadow-xl ring-2 ring-primary/20 scale-102'
                : 'border-border bg-surface shadow-xs hover:border-primary/50 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">person_search</span>
              </div>

              {activeRole === 'buyer' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white mb-2 inline-block">
                  บทบาทปัจจุบัน
                </span>
              )}

              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                ผู้ซื้อ / ผู้เช่า (Buyer)
              </h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                เหมาะสำหรับผู้ที่กำลังมองหาบ้าน คอนโด หรือที่ดินเพื่ออยู่อาศัยหรือเปิดกิจการในจังหวัดอุดรธานี
              </p>

              <div className="space-y-2.5 my-6 pt-6 border-t border-border text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>ค้นหาบนแผนที่อุดรธานี คมชัด ไม่มีลายน้ำ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>เปรียบเทียบสเปกและราคาได้สูงสุด 3 ทรัพย์</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>จองคิวนัดเข้าชมทรัพย์จริง พร้อมพิกัดนำทาง</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary shrink-0">check_circle</span>
                  <span>ปักหมุดบอกความต้องการ (Reverse Pin)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'buyer'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-slate-100 hover:bg-primary hover:text-white text-slate-800'
              }`}
            >
              <span>{activeRole === 'buyer' ? 'กำลังใช้งานอยู่' : 'เลือกบทบาทผู้ซื้อ/ผู้เช่า'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
