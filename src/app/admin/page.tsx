'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

interface KYCItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  docType: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ReviewListing {
  id: string;
  code: string;
  title: string;
  owner: string;
  price: string;
  category: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ReportItem {
  id: string;
  listingCode: string;
  listingTitle: string;
  reporter: string;
  reason: string;
  reportedAt: string;
  status: 'open' | 'resolved' | 'dismissed';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'kyc' | 'listings' | 'reports'>('kyc');

  // State for mock KYC items
  const [kycList, setKycList] = useState<KYCItem[]>([
    {
      id: 'kyc-1',
      name: 'คุณสมหญิง บุญรักษา',
      role: 'นายหน้าอิสระ (Agent Pro)',
      phone: '081-882-9901',
      docType: 'บัตร ปชช. + ใบรับรองนายหน้า TREBA',
      submittedAt: '10 นาทีที่แล้ว',
      status: 'pending',
    },
    {
      id: 'kyc-2',
      name: 'คุณวิชัย พัฒนาการ',
      role: 'เจ้าของโครงการ / Developer',
      phone: '089-445-1212',
      docType: 'หนังสือรับรองนิติบุคคล + บัตรกรรมการ',
      submittedAt: '45 นาทีที่แล้ว',
      status: 'pending',
    },
    {
      id: 'kyc-3',
      name: 'คุณกิตติศักดิ์ เจริญยนต์',
      role: 'นายหน้าสังกัด Agency',
      phone: '086-778-5544',
      docType: 'บัตร ปชช. + หนังสือแต่งตั้งตัวแทน',
      submittedAt: '2 ชม. ที่แล้ว',
      status: 'pending',
    },
  ]);

  // State for mock listings awaiting review
  const [listingsQueue, setListingsQueue] = useState<ReviewListing[]>([
    {
      id: 'rev-1',
      code: 'UD-00113',
      title: 'ทาวน์โฮมโมเดิร์น 2 ชั้น โซนหนองประจักษ์ ตกแต่งใหม่',
      owner: 'คุณสมชาย ยิ่งเจริญ',
      price: '฿2,650,000',
      category: 'ทาวน์โฮม',
      submittedAt: '30 นาทีที่แล้ว',
      status: 'pending',
    },
    {
      id: 'rev-2',
      code: 'UD-00114',
      title: 'ที่ดินแปลงสวย 150 ตร.ว. เหมาะสร้างบ้าน โซนบ้านเลื่อม',
      owner: 'คุณณัฐวุฒิ สิทธิโชค',
      price: '฿3,200,000',
      category: 'ที่ดินเปล่า',
      submittedAt: '1 ชม. ที่แล้ว',
      status: 'pending',
    },
  ]);

  // State for mock scam / duplicate reports
  const [reportsList, setReportsList] = useState<ReportItem[]>([
    {
      id: 'rep-1',
      listingCode: 'UD-00101',
      listingTitle: 'ลุมพินี เพลส ยูดี-โพศรี',
      reporter: 'ผู้ใช้ทั่วไป (คุณธนพล)',
      reason: 'สงสัยรูปภาพซ้ำซ้อนกับประกาศอื่นในโซเชียล',
      reportedAt: '3 ชม. ที่แล้ว',
      status: 'open',
    },
    {
      id: 'rep-2',
      listingCode: 'UD-00105',
      listingTitle: 'คอนโด กัลปพฤกษ์ ซิตี้ พลัส',
      reporter: 'เอเจนต์พาร์ตเนอร์',
      reason: 'เบอร์โทรผู้ติดต่อไม่สามารถติดต่อได้',
      reportedAt: '1 วันที่แล้ว',
      status: 'open',
    },
  ]);

  const handleKycAction = (id: string, action: 'approved' | 'rejected') => {
    setKycList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: action } : k))
    );
  };

  const handleListingAction = (id: string, action: 'approved' | 'rejected') => {
    setListingsQueue((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: action } : l))
    );
  };

  const handleReportAction = (id: string, action: 'resolved' | 'dismissed') => {
    setReportsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <Navbar />

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full w-fit mb-2">
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>MapNest Trust & Operations Portal (S45)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              ศูนย์ปฏิบัติการและตรวจสอบ (Admin & Operations)
            </h1>
            <p className="text-sm text-muted mt-1">
              ดูแลความปลอดภัย ตรวจสอบเอกสาร KYC ยืนยันตัวตน และจัดการคุณภาพประกาศในจังหวัดอุดรธานี
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-status-active/10 text-status-active font-bold text-xs rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-status-active animate-pulse" />
              <span>ระบบทำงานปกติ (All Systems Healthy)</span>
            </span>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-surface rounded-2xl border border-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">รออนุมัติ KYC นายหน้า</span>
              <span className="w-8 h-8 rounded-lg bg-teal-50 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </span>
            </div>
            <div className="text-3xl font-black text-foreground mt-2">
              {kycList.filter((k) => k.status === 'pending').length}
            </div>
            <div className="text-[11px] text-teal-700 font-semibold mt-1">S46 KYC Verification Queue</div>
          </div>

          <div className="p-5 bg-surface rounded-2xl border border-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">รอตรวจสอบประกาศใหม่</span>
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
              </span>
            </div>
            <div className="text-3xl font-black text-foreground mt-2">
              {listingsQueue.filter((l) => l.status === 'pending').length}
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-1">S47 Listing Review Queue</div>
          </div>

          <div className="p-5 bg-surface rounded-2xl border border-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">รายงานปัญหา / สแปม</span>
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">report</span>
              </span>
            </div>
            <div className="text-3xl font-black text-foreground mt-2">
              {reportsList.filter((r) => r.status === 'open').length}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold mt-1">S48 Fraud & Duplicate Reports</div>
          </div>

          <div className="p-5 bg-surface rounded-2xl border border-border shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted">ประกาศค้างเกิน 90 วัน</span>
              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">history</span>
              </span>
            </div>
            <div className="text-3xl font-black text-foreground mt-2">0</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-1">S49 Cleaned (Rule O9 Active)</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kyc'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>ตรวจสอบ KYC นายหน้า ({kycList.filter((k) => k.status === 'pending').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'listings'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">rate_review</span>
            <span>อนุมัติประกาศใหม่ ({listingsQueue.filter((l) => l.status === 'pending').length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>เรื่องร้องเรียน ({reportsList.filter((r) => r.status === 'open').length})</span>
          </button>
        </div>

        {/* Tab Content 1: KYC Queue */}
        {activeTab === 'kyc' && (
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground">
                คิวตรวจสอบยืนยันตัวตนตัวแทนนายหน้า (S46 KYC Verification Queue)
              </h3>
              <span className="text-xs text-muted">ตรวจสอบความถูกต้องเพื่อมอบป้าย Verified</span>
            </div>

            <div className="divide-y divide-border">
              {kycList.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-primary font-bold flex items-center justify-center shrink-0">
                      {item.name.charAt(3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                          {item.role}
                        </span>
                      </div>
                      <div className="text-xs text-muted mt-1">
                        เบอร์โทร: <span className="font-medium text-foreground">{item.phone}</span> • เอกสาร: <span className="font-semibold text-primary">{item.docType}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">ส่งเอกสารเมื่อ {item.submittedAt}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleKycAction(item.id, 'approved')}
                          className="px-3.5 py-1.5 bg-status-active text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>อนุมัติ KYC</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleKycAction(item.id, 'rejected')}
                          className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          ปฏิเสธ
                        </button>
                      </>
                    ) : item.status === 'approved' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-status-active/10 text-status-active flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>อนุมัติแล้ว</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                        ปฏิเสธแล้ว
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: Listings Review */}
        {activeTab === 'listings' && (
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground">
                คิวตรวจสอบความถูกต้องของประกาศใหม่ (S47 Listing Review)
              </h3>
              <span className="text-xs text-muted">ตรวจสอบรูปภาพและพิกัดตาม Blueprint Rule O5</span>
            </div>

            <div className="divide-y divide-border">
              {listingsQueue.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-black text-white">
                        {item.code}
                      </span>
                      <span className="text-sm font-bold text-foreground">{item.title}</span>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      ผู้ลงประกาศ: <span className="font-semibold text-foreground">{item.owner}</span> • ราคา: <span className="font-bold text-primary">{item.price}</span> • ประเภท: {item.category}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">ส่งตรวจเมื่อ {item.submittedAt}</div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleListingAction(item.id, 'approved')}
                          className="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">publish</span>
                          <span>อนุมัติเผยแพร่</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleListingAction(item.id, 'rejected')}
                          className="px-3 py-1.5 border border-border hover:bg-slate-50 text-muted rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          ขอแก้ไขข้อมูล
                        </button>
                      </>
                    ) : item.status === 'approved' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-status-active/10 text-status-active flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>เผยแพร่แล้ว</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-muted">
                        ส่งกลับแก้ไข
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Scam & Duplicate Reports */}
        {activeTab === 'reports' && (
          <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground">
                เรื่องร้องเรียนความปลอดภัยและประกาศซ้ำ (S48 Reports & Scam)
              </h3>
              <span className="text-xs text-muted">ระงับประกาศที่หลอกลวงเพื่อรักษามาตรฐาน</span>
            </div>

            <div className="divide-y divide-border">
              {reportsList.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-white">
                        {item.listingCode}
                      </span>
                      <span className="text-sm font-bold text-foreground">{item.listingTitle}</span>
                    </div>
                    <div className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">warning</span>
                      <span>เหตุผล: {item.reason}</span>
                    </div>
                    <div className="text-[11px] text-muted mt-0.5">
                      ผู้แจ้ง: {item.reporter} • เมื่อ {item.reportedAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.status === 'open' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleReportAction(item.id, 'resolved')}
                          className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">block</span>
                          <span>ระงับประกาศ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReportAction(item.id, 'dismissed')}
                          className="px-3 py-1.5 border border-border hover:bg-slate-50 text-muted rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          ยกเลิกรายงาน
                        </button>
                      </>
                    ) : item.status === 'resolved' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        ระงับประกาศแล้ว
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-muted">
                        ปิดเคสแล้ว
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
