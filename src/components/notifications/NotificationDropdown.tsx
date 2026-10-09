'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  MessageSquare,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'match' | 'message' | 'appointment' | 'waitlist' | 'kyc';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  link: string;
  group: 'today' | 'earlier';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'match',
    title: 'มีทรัพย์ใหม่ตรงกับเกณฑ์ที่คุณปักหมุดไว้',
    description: 'คอนโด ลุมพินี เพลส ยูดี-โพศรี (฿1.45M) ในรัศมี 1.5 กม. จากเซ็นทรัลพลาซา',
    time: '10 นาทีที่แล้ว',
    isRead: false,
    link: '/listing/UD-00101',
    group: 'today',
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'คุณธนกฤต ส่งข้อความถึงคุณ',
    description: 'ยินดีครับ สะดวกนัดดูห้องจริงวันเสาร์นี้ช่วงบ่าย 2 โมงได้เลยครับ...',
    time: '1 ชั่วโมงที่แล้ว',
    isRead: false,
    link: '/messages?to=%E0%B8%98%E0%B8%99%E0%B8%81%E0%B8%A4%E0%B8%95%20%E0%B8%A7%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B9%8C%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%B2%E0%B8%81%E0%B8%A3&code=UD-00101',
    group: 'today',
  },
  {
    id: 'notif-3',
    type: 'appointment',
    title: 'แจ้งเตือนนัดหมายชมห้องจริง',
    description: 'พรุ่งนี้ 10:30 น. โครงการลุมพินี เพลส (ดูแลโดย คุณสมหญิง บุญรักษา)',
    time: '3 ชั่วโมงที่แล้ว',
    isRead: false,
    link: '/appointments',
    group: 'today',
  },
  {
    id: 'notif-4',
    type: 'waitlist',
    title: 'อัปเดตคิวจองสำรอง (Waitlist)',
    description: 'ทรัพย์ UD-00103 บ้านเดี่ยว ศุภาลัย เบลล่า กำลังจะหมดระยะเวลาจองสัญญาเดิม',
    time: 'เมื่อวานนี้',
    isRead: true,
    link: '/saved',
    group: 'earlier',
  },
  {
    id: 'notif-5',
    type: 'kyc',
    title: 'ยืนยันตัวตน KYC สำเร็จแล้ว',
    description: 'เอกสารของคุณผ่านการอนุมัติแล้ว ได้รับตราสัญลักษณ์ Verified เรียบร้อย',
    time: '2 วันที่แล้ว',
    isRead: true,
    link: '/account',
    group: 'earlier',
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-teal-600" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'waitlist':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'kyc':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const todayList = notifications.filter((n) => n.group === 'today');
  const earlierList = notifications.filter((n) => n.group === 'earlier');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="การแจ้งเตือน"
        title="การแจ้งเตือน"
        className="relative w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[22px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-status-sold text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-card rounded-2xl border border-border-subtle shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-50/80 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-on-surface">การแจ้งเตือน</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                  {unreadCount} ใหม่
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>อ่านทั้งหมด</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border-subtle">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                ไม่มีการแจ้งเตือนใหม่ในขณะนี้
              </div>
            ) : (
              <>
                {todayList.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1.5 bg-slate-100/60 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      วันนี้
                    </div>
                    {todayList.map((item) => (
                      <Link
                        key={item.id}
                        href={item.link}
                        onClick={() => {
                          markAsRead(item.id);
                          setIsOpen(false);
                        }}
                        className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 block ${
                          !item.isRead ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-surface-card border border-border-subtle shrink-0 shadow-xs mt-0.5">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4
                              className={`text-xs truncate ${
                                !item.isRead ? 'font-bold text-on-surface' : 'font-medium text-slate-700'
                              }`}
                            >
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-text-muted shrink-0">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {earlierList.length > 0 && (
                  <div>
                    <div className="px-3.5 py-1.5 bg-slate-100/60 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      ก่อนหน้านี้
                    </div>
                    {earlierList.map((item) => (
                      <Link
                        key={item.id}
                        href={item.link}
                        onClick={() => {
                          markAsRead(item.id);
                          setIsOpen(false);
                        }}
                        className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 block ${
                          !item.isRead ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-surface-card border border-border-subtle shrink-0 shadow-xs mt-0.5">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4
                              className={`text-xs truncate ${
                                !item.isRead ? 'font-bold text-on-surface' : 'font-medium text-slate-700'
                              }`}
                            >
                              {item.title}
                            </h4>
                            <span className="text-[10px] text-text-muted shrink-0">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50/70 border-t border-border-subtle text-center">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1"
            >
              <span>ตั้งค่าการแจ้งเตือน (S04)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
