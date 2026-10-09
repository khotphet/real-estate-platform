'use client';

import React from 'react';
import Link from 'next/link';

export function DemandBanner() {
  return (
    <div className="w-full my-6 rounded-2xl bg-surface border border-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[28px]">pin_drop</span>
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-foreground">
            ไม่เจอที่ถูกใจ? ปักหมุดความต้องการ (Post Demand Pin)
          </h3>
          <p className="text-sm text-muted mt-1">
            แจ้งทำเล ประเภท และงบประมาณที่คุณมองหา แล้วให้นายหน้ามืออาชีพที่ยืนยันตัวตนในอุดรธานีช่วยค้นหาให้คุณฟรี
          </p>
        </div>
      </div>
      <Link
        href="#demand"
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-[#115e59] text-white text-sm font-semibold shrink-0 shadow-xs transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
        <span>ปักหมุดค้นหาทรัพย์ฟรี</span>
      </Link>
    </div>
  );
}
