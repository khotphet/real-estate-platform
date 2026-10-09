'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Share2,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Phone,
  MessageCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Bed,
  Bath,
  Maximize,
  Compass,
  Car,
  Receipt,
  Armchair,
  Building,
  Flag,
  Images,
} from 'lucide-react';
import { Listing } from '@/types/listing';
import { MOCK_LISTINGS } from '@/data/mock-listings';
import { LoanCalculatorModal } from './LoanCalculatorModal';
import { PhotoGalleryModal } from './PhotoGalleryModal';
import { AppointmentModal } from './AppointmentModal';
import { WaitlistModal } from './WaitlistModal';
import { FavoriteButton } from './FavoriteButton';
import { calculateMortgage } from '@/lib/mortgage';

interface PropertyDetailViewProps {
  listing: Listing;
}

export function PropertyDetailView({ listing }: PropertyDetailViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  // Modals state
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  // Similar listings (same province, excluding current)
  const similarListings = MOCK_LISTINGS.filter(
    (item) => item.code !== listing.code && item.status !== 'sold'
  ).slice(0, 3);

  // Share handler
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const openGalleryAt = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  // Helper for property type label
  const propertyTypeLabel = {
    condo: 'คอนโดมิเนียม',
    house: 'บ้านเดี่ยว',
    townhome: 'ทาวน์โฮม',
    land: 'ที่ดิน',
    commercial: 'อาคารพาณิชย์',
  }[listing.propertyType];

  // Standard mortgage calculation synchronized with LoanCalculatorModal
  const mortgageEst = useMemo(
    () => calculateMortgage({ price: listing.price }),
    [listing.price]
  );

  return (
    <div className="w-full bg-canvas-background">
      {/* Top Action Breadcrumb Bar */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <nav className="flex items-center flex-wrap gap-2 text-text-muted text-xs sm:text-sm">
            <Link href="/" className="hover:text-primary transition-colors">
              หน้าแรก
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <Link href="/" className="hover:text-primary transition-colors">
              {listing.location.province}
            </Link>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-text-muted">{propertyTypeLabel}</span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-on-surface font-medium truncate max-w-xs">
              {listing.title}
            </span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleShare}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-surface-card hover:bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm rounded-xl border border-border-subtle shadow-sm transition-colors"
              type="button"
            >
              <Share2 className="w-4 h-4 text-text-muted" />
              <span>แชร์</span>
              {copiedLink && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-zinc-900 text-white text-[11px] rounded-md whitespace-nowrap shadow-md">
                  คัดลอกลิงก์แล้ว!
                </span>
              )}
            </button>
            <FavoriteButton code={listing.code} variant="pill" />
            <Link
              href={`/compare?codes=${listing.code},UD-00102,UD-00104`}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-card hover:bg-surface-container-low font-medium text-xs sm:text-sm text-on-surface rounded-xl border border-border-subtle shadow-sm transition-colors cursor-pointer"
              title="เปรียบเทียบทรัพย์นี้กับทรัพย์อื่น"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">compare_arrows</span>
              <span>เปรียบเทียบ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Photo Gallery Bento Grid */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm bg-surface-card border border-border-subtle">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-[340px] sm:h-[440px]">
            {/* Main Prominent Photo */}
            <div
              onClick={() => openGalleryAt(0)}
              className="lg:col-span-2 relative h-full overflow-hidden group cursor-pointer"
            >
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Images className="w-3.5 h-3.5 text-teal-300" />
                <span>ภาพถ่ายสถานที่จริง ({listing.photoCount} รูป)</span>
              </div>
            </div>

            {/* Secondary Grid (Living & Bedroom) */}
            <div className="hidden lg:grid grid-rows-2 gap-2 h-full">
              <div
                onClick={() => openGalleryAt(1 % listing.images.length)}
                className="relative overflow-hidden group cursor-pointer"
              >
                <img
                  src={listing.images[1] || listing.images[0]}
                  alt="ภาพมุมที่ 2"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded">
                  ห้องนั่งเล่น / ภายใน
                </span>
              </div>
              <div
                onClick={() => openGalleryAt(2 % listing.images.length)}
                className="relative overflow-hidden group cursor-pointer"
              >
                <img
                  src={listing.images[2] || listing.images[0]}
                  alt="ภาพมุมที่ 3"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded">
                  ห้องนอน
                </span>
              </div>
            </div>

            {/* Third Grid (Bathroom & Facilities + Full Gallery Button) */}
            <div className="hidden lg:grid grid-rows-2 gap-2 h-full">
              <div
                onClick={() => openGalleryAt(3 % listing.images.length)}
                className="relative overflow-hidden group cursor-pointer"
              >
                <img
                  src={listing.images[3] || listing.images[0]}
                  alt="ภาพมุมที่ 4"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded">
                  ห้องน้ำ / ระเบียง
                </span>
              </div>
              <div
                onClick={() => openGalleryAt(0)}
                className="relative overflow-hidden group cursor-pointer"
              >
                <img
                  src={listing.images[4] || listing.images[0]}
                  alt="ภาพมุมที่ 5"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded">
                  ส่วนกลาง / สระว่ายน้ำ
                </span>
                <button
                  type="button"
                  className="absolute inset-0 bg-black/45 hover:bg-black/60 backdrop-blur-[2px] transition-all flex items-center justify-center text-white font-bold gap-2 text-sm sm:text-base"
                >
                  <Images className="w-5 h-5" />
                  <span>+{listing.photoCount} รูปภาพ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sticky Sidebar Grid */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Specs, Amenities, Description, Location (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
            {/* Header Key Information Card */}
            <div className="bg-surface-card p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2.5">
                {listing.status === 'available' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {listing.dealType === 'rent' ? 'ให้เช่า (Available)' : 'ขาย (Available)'}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    ติดจอง (Reserved)
                  </span>
                )}

                {listing.isVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary border border-primary/20 rounded-full text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ยืนยันกรรมสิทธิ์แล้ว (Verified)
                  </span>
                )}

                <span className="text-xs text-text-muted ml-auto font-mono">
                  รหัสทรัพย์: {listing.code}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
                  {listing.title}
                </h1>
                <div className="flex items-start gap-2 text-text-muted text-sm">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    {listing.location.address}, ต.{listing.location.subdistrict} อ.{listing.location.district} จ.{listing.location.province}
                    {listing.location.nearLandmark && ` · ใกล้ ${listing.location.nearLandmark}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 bg-canvas-background p-5 rounded-xl border border-border-subtle">
                <div>
                  <div className="text-text-muted text-xs uppercase tracking-wider mb-1">
                    {listing.dealType === 'rent' ? 'ค่าเช่ารายเดือน' : 'ราคาขายสุทธิ'}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-primary font-price leading-none">
                      {listing.priceFormatted}
                    </span>
                    {listing.specs.usableAreaSqm && listing.dealType === 'sale' && (
                      <span className="text-sm text-text-muted">
                        (฿{Math.round(listing.price / listing.specs.usableAreaSqm).toLocaleString()} / ตร.ม.)
                      </span>
                    )}
                  </div>
                </div>

                {/* Loan Pill Trigger */}
                {listing.dealType === 'sale' && (
                  <button
                    type="button"
                    onClick={() => setIsLoanModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-card hover:bg-primary-light text-primary border border-border-subtle rounded-full text-xs font-semibold shadow-sm transition-colors self-start sm:self-center"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>ผ่อนเริ่มต้น ~฿{mortgageEst.monthlyPayment.toLocaleString()}/เดือน · คำนวณสินเชื่อ &gt;</span>
                  </button>
                )}
              </div>
            </div>

            {/* Specs Grid Details */}
            <div className="bg-surface-card p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm">
              <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full"></span>
                ข้อมูลสำคัญของทรัพย์ (Property Specs)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {listing.specs.usableAreaSqm && (
                  <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                    <Maximize className="w-5 h-5 text-primary" />
                    <span className="text-xs text-text-muted">พื้นที่ใช้สอย</span>
                    <span className="font-bold text-on-surface">{listing.specs.usableAreaSqm} ตร.ม.</span>
                  </div>
                )}
                {listing.specs.landAreaSqwa && (
                  <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                    <Building className="w-5 h-5 text-primary" />
                    <span className="text-xs text-text-muted">เนื้อที่ดิน</span>
                    <span className="font-bold text-on-surface">{listing.specs.landAreaSqwa} ตร.ว.</span>
                  </div>
                )}
                {listing.specs.bedrooms !== undefined && (
                  <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                    <Bed className="w-5 h-5 text-primary" />
                    <span className="text-xs text-text-muted">ห้องนอน</span>
                    <span className="font-bold text-on-surface">{listing.specs.bedrooms} ห้องนอน</span>
                  </div>
                )}
                {listing.specs.bathrooms !== undefined && (
                  <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                    <Bath className="w-5 h-5 text-primary" />
                    <span className="text-xs text-text-muted">ห้องน้ำ</span>
                    <span className="font-bold text-on-surface">{listing.specs.bathrooms} ห้องน้ำ</span>
                  </div>
                )}
                {listing.specs.floor && (
                  <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                    <Building className="w-5 h-5 text-primary" />
                    <span className="text-xs text-text-muted">ชั้น / อาคาร</span>
                    <span className="font-bold text-on-surface">
                      ชั้น {listing.specs.floor} {listing.specs.building ? `(${listing.specs.building})` : ''}
                    </span>
                  </div>
                )}
                <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                  <Compass className="w-5 h-5 text-primary" />
                  <span className="text-xs text-text-muted">ทิศทางระเบียง</span>
                  <span className="font-bold text-on-surface">
                    {listing.specs.direction || 'ทิศเหนือ (ลมดี)'}
                  </span>
                </div>
                <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="text-xs text-text-muted">สิทธิ์ที่จอดรถ</span>
                  <span className="font-bold text-on-surface">
                    {listing.specs.parking ? `${listing.specs.parking} คัน` : '1 คัน'}
                  </span>
                </div>
                <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                  <Receipt className="w-5 h-5 text-primary" />
                  <span className="text-xs text-text-muted">ค่าส่วนกลาง</span>
                  <span className="font-bold text-on-surface">
                    {listing.specs.commonFee || '฿35 / ตร.ม. / ด.'}
                  </span>
                </div>
                <div className="p-4 bg-canvas-background rounded-xl flex flex-col gap-1 border border-border-subtle">
                  <Armchair className="w-5 h-5 text-primary" />
                  <span className="text-xs text-text-muted">สถานะการตกแต่ง</span>
                  <span className="font-bold text-on-surface">
                    {listing.specs.furnishedStatus || 'ตกแต่งพร้อมอยู่'}
                  </span>
                </div>
              </div>
            </div>

            {/* Highlights & Facilities */}
            <div className="bg-surface-card p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm">
              <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full"></span>
                สิ่งอำนวยความสะดวกในโครงการ (Facilities)
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(
                  listing.amenities || [
                    { name: 'สระว่ายน้ำระบบเกลือ', icon: 'pool' },
                    { name: 'ห้องฟิตเนสวิวสวน', icon: 'fitness_center' },
                    { name: 'สวนพักผ่อนส่วนกลาง', icon: 'park' },
                    { name: 'ระบบคีย์การ์ดสแกน', icon: 'badge' },
                    { name: 'รปภ. ดูแล 24 ชม.', icon: 'shield' },
                    { name: 'กล้องวงจรปิด CCTV', icon: 'videocam' },
                    { name: 'ที่จอดรถในร่ม', icon: 'local_parking' },
                    { name: '7-Eleven ในโครงการ', icon: 'storefront' },
                  ]
                ).map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-canvas-background rounded-xl border border-border-subtle"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center text-primary shadow-xs shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-on-surface truncate">
                      {amenity.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-surface-card p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm">
              <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full"></span>
                รายละเอียดทรัพย์ (Description)
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-on-surface-variant leading-relaxed">
                <p>{listing.description}</p>
                <div>
                  <strong className="text-on-surface block mb-2">จุดเด่นและรายการของแถม:</strong>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-text-muted">
                    {listing.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                    <li>เครื่องปรับอากาศติดตั้งครบทุกห้อง พร้อมเครื่องทำน้ำอุ่น</li>
                    <li>ผ้าม่านกัน UV 2 ชั้น ติดตั้งครบทุกบาน</li>
                    <li>เดินทางสะดวก ใกล้แหล่งช้อปปิ้งและศูนย์ราชการอุดรธานี</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Location & Nearby Places */}
            <div className="bg-surface-card p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm">
              <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-primary rounded-full"></span>
                ทำเลที่ตั้ง & สถานที่ใกล้เคียง (Location & Landmarks)
              </h2>

              {/* Map Preview Canvas */}
              <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden shadow-sm mb-6 bg-slate-100 border border-border-subtle">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdR_PqzxHb2cfK6aLdUsXjGuKAiKUcfyRT8oGCHn6BpMU_pT2aEGqWjcRGssn8BPAIAEYqx5Pez2_y5w9IPBubjbpoginuQZ6kCWV_agGlPpsQ2jGmuiOpGXxoH2Da9kyG3C63S4cdmkdYvhSHmUEKiEvgjnhZ2UAbpuLYnQvoqCmH8z6valFu170os-fhWO9oEWJiVUVXL0a-qWT6ejpmuj2GVvQt3Q6hatnhWSg')`,
                  }}
                ></div>
                <div className="absolute top-4 left-4 bg-surface-card/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-2 border border-border-subtle">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-on-surface">
                    {listing.title} ({listing.location.lat.toFixed(4)}, {listing.location.lng.toFixed(4)})
                  </span>
                </div>
                <a
                  href={`https://maps.google.com/?q=${listing.location.lat},${listing.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-surface-card hover:bg-surface-container-low text-primary px-3.5 py-1.5 rounded-lg shadow-sm text-xs font-semibold flex items-center gap-1.5 border border-border-subtle transition-colors"
                >
                  <span>เปิดดูบน Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Proximity List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  listing.landmarks || [
                    { name: 'UD Town (ยูดี ทาวน์)', distance: '400 ม.' },
                    { name: 'โรงพยาบาลเอกอุดร', distance: '650 ม.' },
                    { name: 'เซ็นทรัล อุดรธานี', distance: '1.2 กม.' },
                    { name: 'สวนสาธารณะหนองประจักษ์', distance: '2.5 กม.' },
                    { name: 'ท่าอากาศยานนานาชาติอุดรธานี (UTH)', distance: '6.0 กม. (12 นาที)' },
                  ]
                ).map((lm, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-canvas-background rounded-xl border border-border-subtle"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-card flex items-center justify-center text-primary shadow-xs">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm text-on-surface font-medium truncate max-w-[180px]">
                        {lm.name}
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-surface-card rounded-md text-primary font-semibold border border-border-subtle">
                      {lm.distance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline Mortgage Calculator Preview Section */}
            {listing.dealType === 'sale' && (
              <div className="bg-surface-card p-6 sm:p-8 rounded-2xl border border-border-subtle shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-primary rounded-full"></span>
                    ประเมินสินเชื่อบ้านเบื้องต้น (Mortgage Estimate)
                  </h2>
                  <span className="text-xs text-text-muted">อัตราดอกเบี้ยเฉลี่ย 3.5% ต่อปี</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-canvas-background rounded-xl border border-border-subtle">
                    <span className="text-xs text-text-muted">ยอดกู้โดยประมาณ ({100 - mortgageEst.downPaymentPct}%)</span>
                    <div className="text-lg font-bold text-on-surface mt-1">
                      ฿{mortgageEst.loanAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 bg-canvas-background rounded-xl border border-border-subtle">
                    <span className="text-xs text-text-muted">เงินดาวน์ ({mortgageEst.downPaymentPct}%)</span>
                    <div className="text-lg font-bold text-on-surface mt-1">
                      ฿{mortgageEst.downPaymentAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 bg-primary-light rounded-xl border border-primary/20">
                    <span className="text-xs text-primary font-semibold">ยอดผ่อนชำระ ({mortgageEst.loanTermYears} ปี)</span>
                    <div className="text-lg font-bold text-primary mt-1">
                      ฿{mortgageEst.monthlyPayment.toLocaleString()} / เดือน
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-canvas-background rounded-xl border border-border-subtle flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <svg className="w-12 h-12 shrink-0 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        className="stroke-slate-200"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="15.9155"
                        strokeWidth="3"
                      ></circle>
                      <circle
                        className="stroke-primary"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="15.9155"
                        strokeDasharray={`${mortgageEst.principalPct}, 100`}
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      ></circle>
                      <circle
                        className="stroke-amber-500"
                        cx="18"
                        cy="18"
                        fill="none"
                        r="15.9155"
                        strokeDasharray={`${mortgageEst.interestPct}, 100`}
                        strokeDashoffset={`-${mortgageEst.principalPct}`}
                        strokeLinecap="round"
                        strokeWidth="3.5"
                      ></circle>
                    </svg>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-on-surface">
                        สัดส่วนเงินต้นและดอกเบี้ยรายงวด
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary"></span>
                          เงินต้น {mortgageEst.principalPct}%
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          ดอกเบี้ย {mortgageEst.interestPct}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLoanModalOpen(true)}
                    className="text-primary hover:text-primary-hover text-xs sm:text-sm font-bold flex items-center gap-1"
                  >
                    <span>ปรับแต่งเงื่อนไขเงินกู้ & ปรึกษาธนาคาร</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar (4 Cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Agent / Poster Transaction Card */}
            <div className="bg-surface-card p-6 rounded-2xl border border-border-subtle shadow-md flex flex-col gap-5">
              {/* Summary Price */}
              <div>
                <span className="text-xs text-text-muted">
                  {listing.dealType === 'rent' ? 'อัตราค่าเช่า' : 'ราคาขาย'}
                </span>
                <div className="text-3xl font-extrabold text-primary font-price mt-0.5">
                  {listing.priceFormatted}
                </div>
                <div className="text-text-muted text-xs mt-1">
                  {listing.dealType === 'rent'
                    ? 'สัญญาขั้นต่ำ 1 ปี (ประกัน 2 เดือน + ล่วงหน้า 1 เดือน)'
                    : 'รวมค่าโอนกรรมสิทธิ์คนละครึ่ง (50/50)'}
                </div>
              </div>

              <div className="h-px w-full bg-border-subtle"></div>

              {/* Status Banner if Reserved */}
              {listing.status === 'reserved' && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">ทรัพย์นี้ติดจองอยู่</strong>
                    <span>
                      มีผู้ทำสัญญาจะซื้อจะขายแล้ว หากสนใจสามารถลงทะเบียน <strong>ต่อคิว (Waitlist)</strong> ได้
                    </span>
                  </div>
                </div>
              )}

              {/* Poster Profile Info */}
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={
                      listing.poster.avatarUrl ||
                      (listing.poster.name.includes('สมหญิง') || listing.poster.role === 'agent'
                        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
                        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG8GjFLGTr4aP_WHHb2s4C2whuNsmS1TRDYDxlYltAXE9cKqwM5Lb-F7cWZG-kUIJ2zKAOzRMGd2k3tWuMVm2r-6-xfV94e1FLurx-GFJm8WBYlfISMOE5Vsas5zL4x0vq5WwYtIocdpKdr8NV8eidcERgpj36ppZfAHI6wZWiW543dSiDzTZYlSg4YCKex-nK3nD8Twxqg3_YWXF-zLh5kBBchCBT7n8tAHJJ5g')
                    }
                    alt={listing.poster.name}
                    className="w-14 h-14 rounded-full object-cover shadow-xs border border-border-subtle"
                  />
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-surface-card"
                    title="ออนไลน์"
                  ></span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-on-surface truncate text-sm sm:text-base">
                      {listing.poster.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.5 bg-primary-light text-primary text-[11px] font-semibold rounded flex items-center gap-1 border border-primary/20">
                      <ShieldCheck className="w-3 h-3" />
                      {listing.poster.role === 'agent' ? 'KYC Lv.2 นายหน้ายืนยันตัวตน' : 'เจ้าของทรัพย์ตัวจริง'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <span className="flex items-center text-amber-500 font-semibold">
                      ★ {listing.poster.rating || 4.9}
                    </span>
                    <span>({listing.poster.reviewCount || 28} รีวิว)</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-medium">
                      {listing.poster.responseTime || 'ตอบกลับใน 15 นาที'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Group */}
              <div className="flex flex-col gap-2.5">
                {listing.status === 'reserved' ? (
                  <button
                    onClick={() => setIsWaitlistOpen(true)}
                    type="button"
                    className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>ต่อคิวทรัพย์ติดจอง (Join Waitlist)</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsAppointmentOpen(true)}
                      className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>ติดต่อ / ส่งข้อความแชท</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAppointmentOpen(true)}
                      className="w-full py-3 px-4 bg-surface-card hover:bg-surface-container-low text-on-surface font-medium text-sm rounded-xl border border-border-subtle shadow-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>ขอนัดหมายชมห้องจริง</span>
                    </button>
                  </>
                )}

                {/* Phone reveal button */}
                <button
                  type="button"
                  onClick={() => setPhoneRevealed(true)}
                  className="w-full py-2.5 px-4 bg-canvas-background hover:bg-surface-container-low text-on-surface font-medium text-xs sm:text-sm rounded-xl border border-border-subtle transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>
                    {phoneRevealed ? (
                      <a href={`tel:${listing.poster.phone || '081-445-8899'}`} className="text-primary font-bold">
                        {listing.poster.phone || '081-445-8899'} (โทรออก)
                      </a>
                    ) : (
                      'ขอเบอร์โทรศัพท์ติดต่อ'
                    )}
                  </span>
                </button>
              </div>

              {/* Trust & Safe Guarantee Note */}
              <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div className="text-xs text-teal-900 leading-tight">
                  <strong className="block font-semibold mb-0.5">MapNest Verified Guarantee</strong>
                  <span>
                    ทรัพย์นี้ผ่านการตรวจโฉนดแล้ว ไม่มีการเรียกเก็บเงินจองนอกระบบ ปลอดภัย 100%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Report Card */}
            <div className="bg-surface-card p-4 rounded-xl border border-border-subtle shadow-xs flex items-center justify-between text-text-muted text-xs">
              <span>พบข้อมูลไม่ถูกต้อง?</span>
              <button
                type="button"
                className="hover:text-red-600 transition-colors flex items-center gap-1 text-red-500 font-medium"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>แจ้งรายงานทรัพย์นี้</span>
              </button>
            </div>
          </div>
        </div>

        {/* Similar Properties Row */}
        <div className="mt-16 mb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight">
                ทรัพย์ที่คล้ายกันในโซนนี้ (Similar Properties)
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                อสังหาริมทรัพย์ทำเลทองใกล้เคียงในเมือง{listing.location.province}
              </p>
            </div>
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1 text-primary hover:text-primary-hover font-semibold text-sm transition-colors"
            >
              <span>ดูทรัพย์ทั้งหมด</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarListings.map((sim) => (
              <Link
                key={sim.code}
                href={`/listing/${sim.code}`}
                className="group bg-surface-card rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={sim.images[0]}
                    alt={sim.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white font-price font-bold text-xs rounded-lg">
                    {sim.priceFormatted}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {sim.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>{sim.location.subdistrict}, {sim.location.province}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border-subtle">
                    <span>{sim.specs.bedrooms ? `${sim.specs.bedrooms} นอน` : 'ที่ดินเปล่า'}</span>
                    <span>{sim.specs.usableAreaSqm ? `${sim.specs.usableAreaSqm} ตร.ม.` : `${sim.specs.landAreaSqwa} ตร.ว.`}</span>
                    <span className="text-primary font-semibold flex items-center gap-0.5">
                      ดูรายละเอียด &gt;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoanCalculatorModal
        key={listing.code}
        listing={listing}
        isOpen={isLoanModalOpen}
        onClose={() => setIsLoanModalOpen(false)}
      />

      <PhotoGalleryModal
        images={listing.images}
        title={listing.title}
        isOpen={isGalleryOpen}
        initialIndex={galleryStartIndex}
        onClose={() => setIsGalleryOpen(false)}
      />

      <AppointmentModal
        listing={listing}
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />

      <WaitlistModal
        listing={listing}
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}
