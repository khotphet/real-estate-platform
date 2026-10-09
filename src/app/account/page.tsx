'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, loginAs } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'kyc' | 'security'>('kyc');

  // Profile Form State
  const [name, setName] = useState(user?.name || 'คุณสมหญิง บุญรักษา');
  const [phone, setPhone] = useState(user?.phone || '081-882-9901');
  const [email, setEmail] = useState('somying@udonpremierrealty.com');
  const [role, setRole] = useState<'owner' | 'agent' | 'buyer'>(user?.role || 'agent');

  // KYC Form State (S31 KYC Upload)
  const [idNumber, setIdNumber] = useState('1-4199-00123-45-6');
  const [licenseNumber, setLicenseNumber] = useState('TREBA-UD-2024-8891');
  const [idCardFile, setIdCardFile] = useState<string | null>('id_card_front_sample.jpg');
  const [licenseFile, setLicenseFile] = useState<string | null>('treba_license_certificate.pdf');
  const [selfieFile, setSelfieFile] = useState<string | null>('selfie_with_id.jpg');
  const [kycStatus, setKycStatus] = useState<'unverified' | 'pending' | 'verified'>('pending');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleRoleChange = (newRole: 'owner' | 'agent' | 'buyer') => {
    setRole(newRole);
    if (user) {
      loginAs({ ...user, role: newRole });
    }
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setKycStatus('pending');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
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
              <span className="text-foreground font-semibold">การตั้งค่าบัญชี & KYC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              จัดการบัญชีและยืนยันตัวตน (S04 & S31)
            </h1>
            <p className="text-sm text-muted mt-1">
              อัปเดตข้อมูลส่วนตัวและส่งเอกสารยืนยันตัวตน KYC เพื่อรับตราสัญลักษณ์ Verified
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              <span>สถานะ: {kycStatus === 'verified' ? 'ยืนยันตัวตนแล้ว' : kycStatus === 'pending' ? 'รอแอดมินอนุมัติ' : 'ยังไม่ยืนยัน'}</span>
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'kyc'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>ยืนยันตัวตน KYC นายหน้า (S31)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>ข้อมูลโปรไฟล์ (S04)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted hover:text-foreground hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">security</span>
            <span>ความปลอดภัย & การแจ้งเตือน</span>
          </button>
        </div>

        {/* Tab 1: KYC Verification Form (S31) */}
        {activeTab === 'kyc' && (
          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xs max-w-3xl">
            <div className="pb-6 mb-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                แบบฟอร์มยืนยันตัวตนผู้ใช้งานและตัวแทนนายหน้า (KYC Verification)
              </h2>
              <p className="text-xs text-muted mt-1">
                การยืนยันตัวตนช่วยเพิ่มความน่าเชื่อถือ ทำให้ประกาศของคุณได้รับสัญลักษณ์ "Verified" และปลดล็อกสิทธิ์ใช้งาน Agent Hub Co-Broker
              </p>
            </div>

            {saveSuccess && (
              <div className="p-4 mb-6 bg-status-active/10 border border-status-active/20 rounded-2xl flex items-center gap-2.5 text-xs text-status-active font-bold animate-in fade-in">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>ส่งเอกสารยืนยันตัวตนเรียบร้อยแล้ว! แอดมินจะดำเนินการตรวจสอบภายใน 24 ชม.</span>
              </div>
            )}

            <form onSubmit={handleKycSubmit} className="space-y-6">
              {/* ID Number */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  หมายเลขบัตรประจำตัวประชาชน 13 หลัก
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="X-XXXX-XXXXX-XX-X"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                  required
                />
              </div>

              {/* Broker License Number */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  เลขที่ใบอนุญาตนายหน้า หรือ เลขที่สมาชิกสมาคมนายหน้า (ถ้ามี)
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="เช่น TREBA-UD-2024-XXXX"
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              {/* Document Upload Slots */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-foreground">อัปโหลดภาพถ่ายเอกสารสำคัญ:</div>

                {/* 1. ID Card Front */}
                <div className="p-4 border border-dashed border-border rounded-2xl flex items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">credit_card</span>
                    </span>
                    <div>
                      <div className="text-xs font-bold text-foreground">1. ภาพถ่ายหน้าบัตรประชาชน</div>
                      <div className="text-[11px] text-muted">เห็นตัวเลข ชื่อนามสกุล และใบหน้าชัดเจน</div>
                      {idCardFile && (
                        <div className="text-[11px] text-primary font-semibold mt-0.5">ไฟล์: {idCardFile}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIdCardFile('id_card_front_sample.jpg')}
                    className="px-3 py-1.5 bg-surface border border-border hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {idCardFile ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                  </button>
                </div>

                {/* 2. Broker License */}
                <div className="p-4 border border-dashed border-border rounded-2xl flex items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">verified</span>
                    </span>
                    <div>
                      <div className="text-xs font-bold text-foreground">2. หนังสือรับรองนายหน้า / นิติบุคคล</div>
                      <div className="text-[11px] text-muted">ใบอนุญาต TREBA, บัตรตัวแทน หรือหนังสือรับรองบริษัท</div>
                      {licenseFile && (
                        <div className="text-[11px] text-primary font-semibold mt-0.5">ไฟล์: {licenseFile}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLicenseFile('treba_license_certificate.pdf')}
                    className="px-3 py-1.5 bg-surface border border-border hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {licenseFile ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                  </button>
                </div>

                {/* 3. Selfie with ID */}
                <div className="p-4 border border-dashed border-border rounded-2xl flex items-center justify-between gap-4 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-purple-50 text-slate-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">photo_camera_front</span>
                    </span>
                    <div>
                      <div className="text-xs font-bold text-foreground">3. ภาพถ่ายคู่บัตรประชาชน (Selfie)</div>
                      <div className="text-[11px] text-muted">ถ่ายภาพใบหน้าคู่กับบัตรประชาชนตัวจริง ไม่สวมหมวกหรือแว่นตาดำ</div>
                      {selfieFile && (
                        <div className="text-[11px] text-primary font-semibold mt-0.5">ไฟล์: {selfieFile}</div>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelfieFile('selfie_with_id.jpg')}
                    className="px-3 py-1.5 bg-surface border border-border hover:bg-slate-100 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {selfieFile ? 'เปลี่ยนไฟล์' : 'เลือกไฟล์'}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">
                        progress_activity
                      </span>
                      <span>กำลังส่งเอกสาร...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      <span>ส่งเอกสารยืนยันตัวตน KYC</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Profile Settings (S04) */}
        {activeTab === 'profile' && (
          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xs max-w-3xl">
            <div className="pb-6 mb-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">ข้อมูลโปรไฟล์ส่วนตัว (Profile Settings)</h2>
              <p className="text-xs text-muted mt-1">กำหนดชื่อ เบอร์โทร และบทบาทผู้ใช้งานของคุณในระบบ MapNest</p>
            </div>

            <div className="space-y-6">
              {/* Role Switcher */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">บทบาทผู้ใช้งานหลัก</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'owner', label: 'เจ้าของทรัพย์ (Owner)', icon: 'home' },
                    { id: 'agent', label: 'นายหน้า (Agent Pro)', icon: 'badge' },
                    { id: 'buyer', label: 'ผู้ซื้อ / ผู้เช่า (Buyer)', icon: 'search' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                        role === r.id
                          ? 'border-primary bg-primary/10 text-primary shadow-xs'
                          : 'border-border text-muted hover:border-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{r.icon}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">เบอร์โทรศัพท์ (ยืนยัน OTP แล้ว)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">อีเมลติดต่อ</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว')}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
                >
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Notification */}
        {activeTab === 'security' && (
          <div className="bg-surface rounded-3xl border border-border p-6 sm:p-10 shadow-xs max-w-3xl">
            <div className="pb-6 mb-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">การแจ้งเตือนและความปลอดภัย</h2>
              <p className="text-xs text-muted mt-1">จัดการช่องทางรับการแจ้งเตือนเมื่อมีผู้สนใจติดต่อหรือมีนัดหมายใหม่</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground">การแจ้งเตือนผ่าน LINE Official Account</div>
                  <div className="text-[11px] text-muted">รับข้อความแจ้งเตือนทันทีเมื่อมีคนนัดชมทรัพย์หรือยื่นข้อเสนอ</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground">การแจ้งเตือนผ่าน SMS</div>
                  <div className="text-[11px] text-muted">แจ้งเตือนสถานะคิวจองสำรอง (Waitlist) ตามเวลาจริง</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-foreground">เข้าสู่ระบบ 2 ขั้นตอน (Two-Factor Authentication)</div>
                  <div className="text-[11px] text-muted">ยืนยันรหัส OTP ทุกครั้งที่มีการเข้าสู่ระบบจากอุปกรณ์ใหม่</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
