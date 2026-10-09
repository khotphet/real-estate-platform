'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border mt-16 text-xs text-muted">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">home_pin</span>
              </div>
              <span className="text-base font-bold text-primary">MapNest</span>
            </div>
            <p className="leading-relaxed">
              แพลตฟอร์มอสังหาริมทรัพย์คุณภาพสูง ประจำจังหวัดอุดรธานี โปร่งใส มั่นใจ ปลอดภัยจากมิจฉาชีพ
            </p>
          </div>

          {/* Col 2: Buyers & Tenants */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-foreground text-sm">สำหรับผู้ซื้อและผู้เช่า</h4>
            <Link href="/" className="hover:text-primary transition-colors">ค้นหาบ้านเดี่ยวและทาวน์โฮม</Link>
            <Link href="/" className="hover:text-primary transition-colors">คอนโดมิเนียมใจกลางเมืองอุดรฯ</Link>
            <Link href="/" className="hover:text-primary transition-colors">ที่ดินแปลงสวยทำเลทอง</Link>
            <Link href="/" className="hover:text-primary transition-colors">แผนที่ราคาประเมินกรมธนารักษ์</Link>
          </div>

          {/* Col 3: Agents & Owners */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-foreground text-sm">บริการนายหน้าและเจ้าของ</h4>
            <Link href="#agent-hub" className="hover:text-primary transition-colors">ศูนย์กลางนายหน้า (Agent Hub)</Link>
            <Link href="#post" className="hover:text-primary transition-colors">ลงประกาศขาย / ให้เช่าทรัพย์</Link>
            <Link href="#packages" className="hover:text-primary transition-colors">แพ็กเกจ Verified Agent</Link>
            <Link href="#co-broke" className="hover:text-primary transition-colors">ระบบสัญญา Co-Broke ดิจิทัล</Link>
          </div>

          {/* Col 4: Trust & Support */}
          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-foreground text-sm">ความปลอดภัยและการช่วยเหลือ</h4>
            <Link href="#verify" className="hover:text-primary transition-colors">ตรวจสอบโฉนดและเอกสารสิทธิ์</Link>
            <Link href="#report" className="hover:text-primary transition-colors">รายงานประกาศน่าสงสัย (S20)</Link>
            <Link href="#guide" className="hover:text-primary transition-colors">คู่มือมาตรฐานวิชาชีพนายหน้า</Link>
            <span className="text-[11px] text-slate-400 mt-2">ศูนย์ประสานงานอุดรธานี โทร 042-999-MAPS</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px]">
            © 2025 MapNest Udon Thani. All rights reserved. ศูนย์ประสานงานอสังหาริมทรัพย์ภาคอีสาน
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="#terms" className="hover:text-primary transition-colors">ข้อกำหนดการใช้งาน</Link>
            <Link href="#privacy" className="hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link href="#security" className="hover:text-primary transition-colors">ความปลอดภัยข้อมูล</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
