'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  Home,
  Building,
  TreePine,
  Store,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  FileText,
  BadgeDollarSign,
  Sparkles,
  Layers,
  Compass,
  Car,
  Receipt,
  Armchair,
  Share2,
  Eye,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyType, DealType } from '@/types/listing';
import { THAILAND_PROVINCES } from '@/data/provinces';

export default function PostPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [newListingCode, setNewListingCode] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Type
    dealType: 'sale' as DealType,
    propertyType: 'condo' as PropertyType,
    projectName: 'ลุมพินี เพลส ยูดี-โพศรี',
    inProject: true,

    // Step 2: Location
    province: 'อุดรธานี',
    district: 'เมืองอุดรธานี',
    subdistrict: 'หมากแข้ง',
    address: 'ถ.โพศรี ใกล้ UD Town',
    lat: 17.404,
    lng: 102.801,
    nearLandmark: 'UD Town (300 ม.)',
    hideExactLocation: false,

    // Step 3: Specs & Price
    price: 1850000,
    transferSplit: 'คนละครึ่ง (50/50)',
    usableAreaSqm: 32,
    landAreaSqwa: 0,
    bedrooms: 1,
    bathrooms: 1,
    floor: 9,
    totalFloors: 14,
    parking: 1,
    direction: 'ทิศเหนือ (ลมดี)',
    commonFee: '฿35 / ตร.ม. / ด.',
    furnishedStatus: 'พร้อมเฟอร์นิเจอร์',

    // Step 4: Photos & Description
    title: 'ขายด่วน คอนโดใจกลางเมืองอุดรธานี แต่งสวย วิวสระว่ายน้ำ พร้อมเข้าอยู่',
    description:
      'ห้องสวยสภาพเยี่ยม เจ้าของดูแลอย่างดี เฟอร์นิเจอร์และเครื่องใช้ไฟฟ้าครบชุด หิ้วกระเป๋าเข้าอยู่ได้ทันที เดินทางสะดวกสบาย ใกล้ศูนย์การค้า UD Town และเซ็นทรัลพลาซา อุดรธานี',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBLQ1NHlXg9p66XDCekgVQ5KARfWnIUDV-EHMeOFA3Vwg_8raHmEOm2Ejj8Q6zFtn8HSPBq_blR0gUuThaSrFw10HJpDUweF3_NZu7dgEjtXqVmlXBdGOw3Mi4iCn_pQlzzMBSce2YDrhsk9FYI5laD61ds9w5MGdubeMhPaZTxCdIzmPzSuHGi4wag37i_AM0U_ux8JymmuzOhiOA1HS5g0yVxI97Yd2_jx-LASsM',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBatXUbL7Z16i4s_RoHDCjf-GniE85cUyYEfcmMxeIuLrI8gkxn88N40avRXDO7Yl3EvwoENWq8y8jC-Iz3O4iNvcWyqQWi2u5IT-iZIlLRglzY7y8rZwCGMINsMhqadeo9EG2NJXmX_u4sMbLtwOfWDDZp4rmLMiM1dhVAePE6Io07NY_6z9MOIyxyIZbBlKVefpeK-5iC9F-a0kt8k-x9pM42s00NJBYrBeUEjf8',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjkMHYsfP3ieiY9qX5RxYonYHQ-GN7-hvR3ddLuvJRbdhpqJ_7aCcPePXsPah8LCs-ak21r-St8yakh5NDhOibthQyYMzjjXhGdUKGHUYckxo1LSxlS2wulFAsSLAZwAfBXB8mWIxCtCCbkzsBitYVTN34zSYtYkAdUHwnL5pexKAOWF6fxAYMsSYqnR82QbhDTO-dCzMDIG-6uuxeITdvY0ZTolZJyYGbnINIAaE',
    ],
    coverIndex: 0,
    features: ['สระว่ายน้ำระบบเกลือ', 'ฟิตเนส', 'รปภ. 24 ชม.', 'กล้องวงจรปิด CCTV', 'ที่จอดรถในร่ม'],
    hasDeed: true,

    // Step 5: Channel
    saleChannel: 'direct' as 'direct' | 'agent_hub',
    commissionPct: 3.0,
    termsAccepted: true,
  });

  const propertyTypes: { type: PropertyType; label: string; desc: string; icon: any }[] = [
    { type: 'condo', label: 'คอนโดมิเนียม', desc: 'ห้องชุดในอาคารชุดพักอาศัย', icon: Building2 },
    { type: 'house', label: 'บ้านเดี่ยว', desc: 'บ้านเดี่ยวพร้อมที่ดินและสวน', icon: Home },
    { type: 'townhome', label: 'ทาวน์โฮม', desc: 'ทาวน์เฮ้าส์ / ทาวน์โฮม 2-3 ชั้น', icon: Building },
    { type: 'land', label: 'ที่ดินเปล่า', desc: 'ที่ดินเพื่อการเกษตร / สร้างบ้าน / ลงทุน', icon: TreePine },
    { type: 'commercial', label: 'อาคารพาณิชย์', desc: 'ตึกแถว / โฮมออฟฟิศ / ร้านค้า', icon: Store },
  ];

  const subdistrictsUdon = [
    'หมากแข้ง',
    'หนองบัว',
    'บ้านเลื่อม',
    'สามพร้าว',
    'หมูม่น',
    'บ้านจั่น',
    'หนองนาคำ',
    'กุดสระ',
  ];

  const allFeatures = [
    'สระว่ายน้ำระบบเกลือ',
    'ฟิตเนส',
    'รปภ. 24 ชม.',
    'กล้องวงจรปิด CCTV',
    'ที่จอดรถในร่ม',
    'ระบบคีย์การ์ดสแกน',
    'สวนพักผ่อนส่วนกลาง',
    'เครื่องปรับอากาศครบ',
    'เครื่องทำน้ำอุ่น',
    'เฟอร์นิเจอร์บิวท์อิน',
    'ใกล้ร้านสะดวกซื้อ 7-Eleven / CJ More',
    'ใกล้ตลาดสด / ตลาดนัด',
    'ใกล้ร้านสะดวกซัก 24 ชม.',
    'ใกล้สถานีชาร์จรถไฟฟ้า EV',
    'ใกล้ห้างสรรพสินค้า',
    'ใกล้โรงพยาบาล',
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit
      const generatedCode = `UD-00${Math.floor(113 + Math.random() * 80)}`;
      setNewListingCode(generatedCode);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFeature = (feat: string) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists ? prev.features.filter((f) => f !== feat) : [...prev.features, feat],
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas-background">
      <Navbar />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-muted mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            หน้าแรก
          </Link>
          <ChevronRight className="w-4 h-4 text-text-muted" />
          <Link href="/my-listings" className="hover:text-primary transition-colors">
            จัดการประกาศของฉัน
          </Link>
          <ChevronRight className="w-4 h-4 text-text-muted" />
          <span className="text-on-surface font-semibold">ลงประกาศใหม่</span>
        </nav>

        {isSubmitted ? (
          /* Success Screen */
          <div className="bg-surface-card rounded-2xl border border-border-subtle p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface mb-2">
              ลงประกาศสำเร็จเรียบร้อย! 🎉
            </h1>
            <p className="text-sm text-text-muted max-w-md mx-auto mb-6">
              ประกาศของคุณถูกบันทึกและแสดงผลบนแผนที่อสังหาริมทรัพย์ จ.อุดรธานี เรียบร้อยแล้ว
            </p>

            <div className="p-4 bg-canvas-background rounded-xl border border-border-subtle max-w-md mx-auto mb-8 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle text-xs text-text-muted">
                <span>รหัสประกาศของคุณ</span>
                <span className="font-mono font-bold text-primary text-sm">{newListingCode}</span>
              </div>
              <div className="pt-2 text-xs text-text-muted space-y-1">
                <p>
                  <strong>หัวข้อ:</strong> {formData.title}
                </p>
                <p>
                  <strong>ราคา:</strong> ฿{formData.price.toLocaleString()} ({formData.dealType === 'sale' ? 'ขาย' : 'ให้เช่า'})
                </p>
                <p>
                  <strong>ทำเล:</strong> ต.{formData.subdistrict} อ.{formData.district} จ.{formData.province}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/my-listings"
                className="w-full sm:w-auto px-6 py-3 bg-surface-card hover:bg-surface-container-low text-on-surface font-semibold text-sm rounded-xl border border-border-subtle transition-colors shadow-xs"
              >
                ไปที่หน้าจัดการประกาศของฉัน
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
              >
                ดูบนแผนที่ค้นหา (หน้าแรก)
              </Link>
            </div>
          </div>
        ) : (
          /* Wizard Workspace */
          <div className="space-y-8">
            {/* Step Progress Header Card (Matching S22) */}
            <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 shadow-xs">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">
                <span className="text-primary font-bold">ขั้นตอนปัจจุบัน: {currentStep} จาก 5</span>
                <span>ความสมบูรณ์แบบร่าง: {currentStep * 20}%</span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-5">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${currentStep * 20}%` }}
                ></div>
              </div>

              {/* 5 Step Badges */}
              <div className="grid grid-cols-5 gap-2 text-left">
                {[
                  { step: 1, title: 'ประเภท & ธุรกรรม', sub: 'ขาย/เช่า' },
                  { step: 2, title: 'ที่ตั้ง & แผนที่', sub: 'ปักหมุดทำเล' },
                  { step: 3, title: 'ราคา & สเปก', sub: 'ขนาด ตร.ม./ตร.ว.' },
                  { step: 4, title: 'รูปภาพ & โฉนด', sub: 'รูปจริง & เอกสาร' },
                  { step: 5, title: 'ตรวจสอบ & เผยแพร่', sub: 'เปิดแสดงผล' },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => s.step < currentStep && setCurrentStep(s.step)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl transition-all text-left ${
                      s.step === currentStep
                        ? 'bg-primary-light/60 border border-primary/20'
                        : s.step < currentStep
                        ? 'cursor-pointer hover:bg-slate-50'
                        : 'opacity-50 cursor-default'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        s.step < currentStep
                          ? 'bg-emerald-500 text-white'
                          : s.step === currentStep
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-slate-100 text-text-muted'
                      }`}
                    >
                      {s.step < currentStep ? '✓' : s.step}
                    </span>
                    <div className="min-w-0 hidden md:block">
                      <p
                        className={`text-xs font-bold truncate ${
                          s.step === currentStep ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">{s.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Form Body */}
            <div className="bg-surface-card rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-xs">
              {/* STEP 1: Type & Transaction */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      ขั้นตอนที่ 1: เลือกรูปแบบธุรกรรมและประเภททรัพย์
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                      ระบุเพื่อส่งต่อให้ตรงกับผู้ซื้อและผู้เช่าในจังหวัดอุดรธานี
                    </p>
                  </div>

                  {/* Transaction Type Radios */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
                      1. รูปแบบธุรกรรม (Transaction Type) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          val: 'sale',
                          label: 'ต้องการขาย (For Sale)',
                          desc: 'ขายขาด โอนกรรมสิทธิ์ที่ดินหรือห้องชุด พร้อมตรวจเอกสารโฉนด',
                        },
                        {
                          val: 'rent',
                          label: 'ต้องการให้เช่า (For Rent)',
                          desc: 'ปล่อยเช่ารายเดือน สัญญาระยะสั้นหรือระยะยาว พร้อมสัญญาเช่ามาตรฐาน',
                        },
                      ].map((t) => (
                        <div
                          key={t.val}
                          onClick={() => setFormData({ ...formData, dealType: t.val as DealType })}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.dealType === t.val
                              ? 'border-primary bg-primary-light/40 shadow-xs'
                              : 'border-border-subtle hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-on-surface text-base">{t.label}</span>
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                formData.dealType === t.val
                                  ? 'bg-primary text-white'
                                  : 'border border-slate-300'
                              }`}
                            >
                              {formData.dealType === t.val && '✓'}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Type Grid */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
                      2. ประเภทอสังหาริมทรัพย์ (Property Type) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {propertyTypes.map((pt) => {
                        const Icon = pt.icon;
                        const isSelected = formData.propertyType === pt.type;
                        return (
                          <div
                            key={pt.type}
                            onClick={() => setFormData({ ...formData, propertyType: pt.type })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'border-primary bg-primary-light/40 shadow-xs'
                                : 'border-border-subtle hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-text-muted'
                                }`}
                              >
                                <Icon className="w-5 h-5" />
                              </div>
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                  isSelected ? 'bg-primary text-white' : 'border border-slate-300'
                                }`}
                              >
                                {isSelected && '✓'}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-bold text-on-surface text-sm sm:text-base">
                                {pt.label}
                              </h3>
                              <p className="text-xs text-text-muted mt-0.5">{pt.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Name (Optional) */}
                  <div className="p-4 bg-canvas-background rounded-xl border border-border-subtle">
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      ชื่อโครงการ (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ลุมพินี เพลส ยูดี-โพศรี, เดอะ เบส เซ็นทรัล อุดรธานี, หรือเว้นว่างหากเป็นบ้านเดี่ยวสร้างเอง"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Location & Map Pinning */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      ขั้นตอนที่ 2: ที่ตั้งและการปักหมุดบนแผนที่
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                      ระบุทำเลจริงของอสังหาริมทรัพย์ เพื่อให้ผู้ซื้อค้นหาพบบนแผนที่ได้อย่างแม่นยำ (รองรับ 77 จังหวัด)
                    </p>
                  </div>

                  {/* Area Pickers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        จังหวัด <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.province}
                        onChange={(e) => {
                          const pName = e.target.value;
                          const pInfo = THAILAND_PROVINCES.find((p) => p.nameTh === pName);
                          setFormData({
                            ...formData,
                            province: pName,
                            lat: pInfo ? pInfo.lat : formData.lat,
                            lng: pInfo ? pInfo.lng : formData.lng,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all font-medium"
                      >
                        {THAILAND_PROVINCES.map((p) => (
                          <option key={p.nameTh} value={p.nameTh}>
                            {p.nameTh} ({p.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        อำเภอ / เขต <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น เมือง, วัฒนา, คลองหลวง"
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        ตำบล / แขวง <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="เช่น หมากแข้ง, คลองเตยเหนือ"
                        value={formData.subdistrict}
                        onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        พิกัด ละติจูด (Latitude)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.lat}
                        onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        พิกัด ลองจิจูด (Longitude)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.lng}
                        onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Detailed Address */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      ถนน / ซอย / ชื่ออาคาร / เลขที่ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ถ.โพศรี ใกล้สถานีรถไฟอุดรธานี และศูนย์การค้ายูดีทาวน์"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                    />
                  </div>

                  {/* Interactive Map Pinning Canvas */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-on-surface flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        ปักหมุดตำแหน่งบนแผนที่ (พิกัด: {formData.lat.toFixed(4)},{' '}
                        {formData.lng.toFixed(4)})
                      </span>
                      <span className="text-text-muted">คลิกเพื่อย้ายหมุด</span>
                    </div>

                    <div
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = (e.clientX - rect.left) / rect.width;
                        const y = (e.clientY - rect.top) / rect.height;
                        // Map 0..1 to Udon bounding box
                        const newLng = 102.75 + x * 0.1;
                        const newLat = 17.44 - y * 0.06;
                        setFormData({
                          ...formData,
                          lat: parseFloat(newLat.toFixed(4)),
                          lng: parseFloat(newLng.toFixed(4)),
                        });
                      }}
                      className="relative w-full h-80 rounded-2xl overflow-hidden border border-border-subtle cursor-crosshair bg-slate-200 shadow-inner group"
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdR_PqzxHb2cfK6aLdUsXjGuKAiKUcfyRT8oGCHn6BpMU_pT2aEGqWjcRGssn8BPAIAEYqx5Pez2_y5w9IPBubjbpoginuQZ6kCWV_agGlPpsQ2jGmuiOpGXxoH2Da9kyG3C63S4cdmkdYvhSHmUEKiEvgjnhZ2UAbpuLYnQvoqCmH8z6valFu170os-fhWO9oEWJiVUVXL0a-qWT6ejpmuj2GVvQt3Q6hatnhWSg')`,
                        }}
                      ></div>

                      {/* Map Pin Marker */}
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 pointer-events-none"
                        style={{
                          left: `${((formData.lng - 102.75) / 0.1) * 100}%`,
                          top: `${((17.44 - formData.lat) / 0.06) * 100}%`,
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <span className="px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-lg shadow-md whitespace-nowrap mb-1">
                            ตำแหน่งทรัพย์
                          </span>
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-primary/40">
                            <MapPin className="w-4 h-4 fill-white" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-surface-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs text-text-muted shadow-sm border border-border-subtle">
                        คลิกบนแผนที่เพื่อปรับพิกัดหมุดให้แม่นยำ
                      </div>
                    </div>
                  </div>

                  {/* Nearby Landmark */}
                  <div>
                    <label className="block text-xs font-semibold text-on-surface mb-1.5">
                      จุดสังเกตหรือสถานที่สำคัญใกล้เคียง
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น ใกล้เซ็นทรัลพลาซา 500 เมตร, หลังตลาดโพศรี, ใกล้โรงพยาบาลศูนย์อุดรธานี"
                      value={formData.nearLandmark}
                      onChange={(e) => setFormData({ ...formData, nearLandmark: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Price & Specs */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      ขั้นตอนที่ 3: ราคาและข้อมูลสเปกทรัพย์
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                      กรอกราคาขาย/เช่า และรายละเอียดขนาดพื้นที่ให้ครบถ้วน
                    </p>
                  </div>

                  {/* Price Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        {formData.dealType === 'sale' ? 'ราคาขายสุทธิ (บาท)' : 'ค่าเช่ารายเดือน (บาท)'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-text-muted font-bold">฿</span>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full pl-8 pr-4 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        เงื่อนไขค่าธรรมเนียมการโอนกรรมสิทธิ์
                      </label>
                      <select
                        value={formData.transferSplit}
                        onChange={(e) => setFormData({ ...formData, transferSplit: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      >
                        <option value="คนละครึ่ง (50/50)">คนละครึ่ง (50/50 - มาตรฐาน)</option>
                        <option value="ผู้ขายออกให้ทั้งหมด">ผู้ขายออกให้ทั้งหมด (Free Transfer)</option>
                        <option value="ผู้ซื้อออกทั้งหมด">ผู้ซื้อออกทั้งหมด</option>
                      </select>
                    </div>
                  </div>

                  {/* Area Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        พื้นที่ใช้สอย (ตร.ม.) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="เช่น 32"
                        value={formData.usableAreaSqm || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, usableAreaSqm: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    {formData.propertyType !== 'condo' && (
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1.5">
                          เนื้อที่ดิน (ตร.ว.)
                        </label>
                        <input
                          type="number"
                          placeholder="เช่น 54"
                          value={formData.landAreaSqwa || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, landAreaSqwa: Number(e.target.value) })
                          }
                          className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Rooms Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        ห้องนอน
                      </label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n === 0 ? 'สตูดิโอ (ไม่มีกั้น)' : `${n} ห้องนอน`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        ห้องน้ำ
                      </label>
                      <select
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} ห้องน้ำ
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        ชั้นที่อยู่
                      </label>
                      <input
                        type="number"
                        placeholder="เช่น 8"
                        value={formData.floor || ''}
                        onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        ที่จอดรถ (คัน)
                      </label>
                      <select
                        value={formData.parking}
                        onChange={(e) => setFormData({ ...formData, parking: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      >
                        {[0, 1, 2, 3, 4].map((n) => (
                          <option key={n} value={n}>
                            {n} คัน
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Direction & Furnishing */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        ทิศระเบียง / หน้าบ้าน
                      </label>
                      <input
                        type="text"
                        value={formData.direction}
                        onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        สถานะการตกแต่ง
                      </label>
                      <select
                        value={formData.furnishedStatus}
                        onChange={(e) => setFormData({ ...formData, furnishedStatus: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      >
                        <option value="พร้อมเฟอร์นิเจอร์">พร้อมเฟอร์นิเจอร์ (Fully Furnished)</option>
                        <option value="ตกแต่งบางส่วน">ตกแต่งบางส่วน (Partially Furnished)</option>
                        <option value="ห้องเปล่า">ห้องเปล่า (Unfurnished)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        ค่าส่วนกลางโดยประมาณ
                      </label>
                      <input
                        type="text"
                        value={formData.commonFee}
                        onChange={(e) => setFormData({ ...formData, commonFee: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Photos, Facilities, & Description */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      ขั้นตอนที่ 4: รูปภาพ สิ่งอำนวยความสะดวก และคำบรรยาย
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                      รูปภาพที่ชัดเจนและคำบรรยายที่ละเอียดช่วยให้ปิดการขายได้เร็วกว่า 3 เท่า
                    </p>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        หัวข้อประกาศ (Title) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1.5">
                        รายละเอียดทรัพย์และจุดเด่น (Description) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-surface-card border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Photos Upload & Gallery */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-2">
                      รูปภาพทรัพย์ (แนบอย่างน้อย 3 รูป)
                    </label>

                    {/* Drag and Drop Zone */}
                    <div className="p-6 border-2 border-dashed border-border-subtle hover:border-primary rounded-2xl bg-canvas-background text-center transition-colors cursor-pointer mb-4">
                      <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-semibold text-on-surface">
                        คลิกเพื่อเลือกรูปภาพ หรือลากไฟล์มาวางที่นี่
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        รองรับไฟล์ JPG, PNG, WebP สูงสุด 20 ภาพ (ขนาดไม่เกิน 10MB ต่อรูป)
                      </p>
                    </div>

                    {/* Photo Previews */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setFormData({ ...formData, coverIndex: idx })}
                          className={`relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            formData.coverIndex === idx
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-border-subtle hover:border-slate-300'
                          }`}
                        >
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          {formData.coverIndex === idx && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded shadow-xs">
                              ภาพหน้าปก
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Facilities Checkboxes */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
                      สิ่งอำนวยความสะดวกในโครงการ
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {allFeatures.map((feat) => {
                        const checked = formData.features.includes(feat);
                        return (
                          <div
                            key={feat}
                            onClick={() => toggleFeature(feat)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                              checked
                                ? 'bg-primary-light/50 border-primary text-primary font-medium'
                                : 'bg-surface-card border-border-subtle text-on-surface hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                checked ? 'bg-primary text-white' : 'border border-slate-300'
                              }`}
                            >
                              {checked && '✓'}
                            </span>
                            <span className="text-xs truncate">{feat}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Publish */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                      ขั้นตอนที่ 5: ตรวจสอบและเลือกช่องทางการเผยแพร่
                    </h2>
                    <p className="text-sm text-text-muted mt-1">
                      ตรวจสอบข้อมูลก่อนนำขึ้นแสดงผลบน MapNest อุดรธานี
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-5 bg-canvas-background rounded-2xl border border-border-subtle space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle">
                      <div>
                        <span className="text-xs px-2.5 py-0.5 bg-primary-light text-primary font-bold rounded-full mr-2">
                          {formData.dealType === 'sale' ? 'ต้องการขาย' : 'ให้เช่า'}
                        </span>
                        <span className="text-xs text-text-muted font-medium">
                          {propertyTypes.find((p) => p.type === formData.propertyType)?.label}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-on-surface mt-1">
                          {formData.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-text-muted block">ราคาเสนอ</span>
                        <span className="text-2xl font-extrabold text-primary font-price">
                          ฿{formData.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-text-muted block">ทำเล</span>
                        <span className="font-semibold text-on-surface">
                          ต.{formData.subdistrict} อ.{formData.district}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block">พื้นที่ใช้สอย</span>
                        <span className="font-semibold text-on-surface">
                          {formData.usableAreaSqm} ตร.ม.
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block">ห้องนอน / ห้องน้ำ</span>
                        <span className="font-semibold text-on-surface">
                          {formData.bedrooms} นอน / {formData.bathrooms} น้ำ
                        </span>
                      </div>
                      <div>
                        <span className="text-text-muted block">ค่าโอน</span>
                        <span className="font-semibold text-on-surface">{formData.transferSplit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel Selection (Direct vs Agent Hub) */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
                      เลือกช่องทางการขาย (Distribution Channel)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => setFormData({ ...formData, saleChannel: 'direct' })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.saleChannel === 'direct'
                            ? 'border-primary bg-primary-light/40 shadow-xs'
                            : 'border-border-subtle hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-on-surface text-sm sm:text-base">
                            ลงประกาศตรง (Direct Listing)
                          </span>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              formData.saleChannel === 'direct'
                                ? 'bg-primary text-white'
                                : 'border border-slate-300'
                            }`}
                          >
                            {formData.saleChannel === 'direct' && '✓'}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                          ไม่มีค่าธรรมเนียม ประกาศขึ้นหน้าค้นหาทันที ผู้ซื้อติดต่อคุณโดยตรง
                        </p>
                      </div>

                      <div
                        onClick={() => setFormData({ ...formData, saleChannel: 'agent_hub' })}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.saleChannel === 'agent_hub'
                            ? 'border-primary bg-primary-light/40 shadow-xs'
                            : 'border-border-subtle hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-on-surface text-sm sm:text-base flex items-center gap-1.5">
                            <span>ฝากนายหน้า Agent Hub</span>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
                              แนะนำ
                            </span>
                          </span>
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              formData.saleChannel === 'agent_hub'
                                ? 'bg-primary text-white'
                                : 'border border-slate-300'
                            }`}
                          >
                            {formData.saleChannel === 'agent_hub' && '✓'}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                          ส่งต่อให้นายหน้ามืออาชีพที่ผ่าน KYC ในอุดรธานีช่วยทำตลาด (ค่าคอมมิชชั่น 3% เมื่อขายสำเร็จ)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Anti-Scam Agreement */}
                  <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-teal-900 leading-relaxed">
                      <strong>มาตรฐานความโปร่งใส MapNest:</strong>{' '}
                      ข้าพเจ้ายืนยันว่าข้อมูลและภาพถ่ายข้างต้นเป็นทรัพย์จริง และยินยอมให้ทีมงานตรวจสอบความถูกต้องของกรรมสิทธิ์เพื่อความปลอดภัยของผู้ซื้อในระบบ
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Nav Controls (Bottom Bar) */}
              <div className="flex items-center justify-between pt-6 mt-8 border-t border-border-subtle">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-5 py-2.5 rounded-xl border border-border-subtle text-on-surface hover:bg-slate-50 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>ย้อนกลับ</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>{currentStep === 5 ? 'ยืนยันและเผยแพร่ประกาศ 🚀' : 'ถัดไป'}</span>
                  {currentStep < 5 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
