'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Send,
  Phone,
  Paperclip,
  Image as ImageIcon,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCheck,
  MoreVertical,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  isAppointmentAction?: boolean;
}

interface Conversation {
  id: string;
  partnerName: string;
  partnerRole: 'agent' | 'owner';
  partnerAvatar: string;
  isVerified: boolean;
  property: {
    code: string;
    title: string;
    price: string;
    dealType: 'sale' | 'rent';
    image: string;
  };
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  messages: Message[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      partnerName: 'ธนกฤต วรวิทย์คุณากร',
      partnerRole: 'agent',
      partnerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCYwILPVniQr0OJxcX-nLxnJkZ8yr4QmddEn-yev-RfXVFAISqRzLBtiVXD9SDEJQ10QUtCuCsyLWavJRWT6OEBaIbgZTaFyMg1fxQXzHKzdV3yksXmPNGOprxkSujVbCDaA8WOMNfPSN0Iwf5q3xw-dwDvbX_U6DmSyJhYhjq1mFbYz_ULRx-T9nF_lKUTbvYiHdB2Eumb8opLNKJkJvaU6WMvsIR8maBQ1a3GUTQ',
      isVerified: true,
      property: {
        code: 'UD-00101',
        title: 'ลุมพินี เพลส ยูดี-โพศรี ชั้น 8 วิวสระ',
        price: '฿1,450,000',
        dealType: 'sale',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBLQ1NHlXg9p66XDCekgVQ5KARfWnIUDV-EHMeOFA3Vwg_8raHmEOm2Ejj8Q6zFtn8HSPBq_blR0gUuThaSrFw10HJpDUweF3_NZu7dgEjtXqVmlXBdGOw3Mi4iCn_pQlzzMBSce2YDrhsk9FYI5laD61ds9w5MGdubeMhPaZTxCdIzmPzSuHGi4wag37i_AM0U_ux8JymmuzOhiOA1HS5g0yVxI97Yd2_jx-LASsM',
      },
      lastMessage: 'ยินดีครับคุณวิชัย สะดวกนัดดูห้องจริงวันเสาร์นี้ช่วงบ่าย 2 โมงได้เลยครับ',
      lastTime: '14:20 น.',
      unreadCount: 2,
      messages: [
        {
          id: 'm1',
          sender: 'me',
          text: 'สวัสดีครับคุณธนกฤต สนใจห้องที่ลุมพินี เพลส ยูดี-โพศรี ชั้น 8 ครับ ราคานี้รวมค่าโอนหรือยังครับ?',
          time: '14:05 น.',
        },
        {
          id: 'm2',
          sender: 'them',
          text: 'สวัสดีครับคุณวิชัย ห้องนี้สภาพใหม่มาก เจ้าของเดิมแทบไม่ได้อยู่ ราคารวมค่าโอนคนละครึ่ง (50/50) ให้แล้วครับ',
          time: '14:10 น.',
        },
        {
          id: 'm3',
          sender: 'me',
          text: 'ถ้าสะดวกนัดดูห้องจริง เสาร์นี้ช่วงบ่าย 2 พอจะว่างไหมครับ?',
          time: '14:15 น.',
        },
        {
          id: 'm4',
          sender: 'them',
          text: 'ยินดีครับคุณวิชัย สะดวกนัดดูห้องจริงวันเสาร์นี้ช่วงบ่าย 2 โมงได้เลยครับ เดี๋ยวผมเตรียมคีย์การ์ดและพาชมส่วนกลางสระว่ายน้ำด้วยครับ',
          time: '14:20 น.',
          isAppointmentAction: true,
        },
      ],
    },
    {
      id: 'conv-2',
      partnerName: 'สมหญิง นายหน้ามือทอง',
      partnerRole: 'agent',
      partnerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCYwILPVniQr0OJxcX-nLxnJkZ8yr4QmddEn-yev-RfXVFAISqRzLBtiVXD9SDEJQ10QUtCuCsyLWavJRWT6OEBaIbgZTaFyMg1fxQXzHKzdV3yksXmPNGOprxkSujVbCDaA8WOMNfPSN0Iwf5q3xw-dwDvbX_U6DmSyJhYhjq1mFbYz_ULRx-T9nF_lKUTbvYiHdB2Eumb8opLNKJkJvaU6WMvsIR8maBQ1a3GUTQ',
      isVerified: true,
      property: {
        code: 'UD-00102',
        title: 'เดอะ เบส เซ็นทรัล อุดรธานี ชั้น 12',
        price: '฿8,500/เดือน',
        dealType: 'rent',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAHMr4Q7599TTF5EFzCtY8O3GLgILny4l5CPkWG35RoqYnelrfFk5jPhSGhyB6lvumyWLOeeEKekS16thsjq5ESRJGjc2Hsi_CsCLply59FVn3S1Y7fKfpVcjlA12bF97escaysMbEbhDG7lEsR7naRm3JDkRmemJlbpmZbb44gVp42YKmXKNWVXLF7wr5L-_96PAdzUtpHitTsdBSf35AcWmy6kEOra26OuJ1jvEQ',
      },
      lastMessage: 'สัญญาเช่าขั้นต่ำ 1 ปี มัดจำ 2 เดือน ล่วงหน้า 1 เดือน พร้อมเข้าอยู่ค่ะ',
      lastTime: 'เมื่อวาน',
      unreadCount: 1,
      messages: [
        {
          id: 'm2-1',
          sender: 'me',
          text: 'สวัสดีครับ ห้องที่ The Base ชั้น 12 ยังว่างอยู่ไหมครับ?',
          time: 'เมื่อวาน 16:30 น.',
        },
        {
          id: 'm2-2',
          sender: 'them',
          text: 'ห้องยังว่างค่ะ สัญญาเช่าขั้นต่ำ 1 ปี มัดจำ 2 เดือน ล่วงหน้า 1 เดือน พร้อมเข้าอยู่ค่ะ',
          time: 'เมื่อวาน 16:35 น.',
        },
      ],
    },
    {
      id: 'conv-3',
      partnerName: 'วิเชียร ทรัพย์มั่งคั่ง',
      partnerRole: 'owner',
      partnerAvatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG8GjFLGTr4aP_WHHb2s4C2whuNsmS1TRDYDxlYltAXE9cKqwM5Lb-F7cWZG-kUIJ2zKAOzRMGd2k3tWuMVm2r-6-xfV94e1FLurx-GFJm8WBYlfISMOE5Vsas5zL4x0vq5WwYtIocdpKdr8NV8eidcERgpj36ppZfAHI6wZWiW543dSiDzTZYlSg4YCKex-nK3nD8Twxqg3_YWXF-zLh5kBBchCBT7n8tAHJJ5g',
      isVerified: true,
      property: {
        code: 'UD-00103',
        title: 'บ้านเดี่ยว ศุภาลัย เบลล่า 2 ชั้น 54 ตร.ว.',
        price: '฿3,890,000',
        dealType: 'sale',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBW66SIhkcxfDIN6T-iXRccSl4CIXHpVbZPM8L3V1k2oTjFltEDbDJf4vVhxy0kXQttFeHGGfcw_iBLmU886VTd62e-C3aCatwILIfDVsip18NmIzLYVg1Hwsy3qqSHHZJ42htcnNsEkCbzgSBrwQ8QcCYdLVSnhmmXYhZQ7AHYXLr1aHPYqepjN1psxwbvP0F4Rt0jwfRs8KG_OZ8sIG3BdQO-hve798ak6AR7rg4',
      },
      lastMessage: 'ตอนนี้มีผู้ทำสัญญาจะซื้อจะขายแล้ว หากหลุดจองจะแจ้งคิวแรกทันทีครับ',
      lastTime: '3 วันก่อน',
      unreadCount: 0,
      messages: [
        {
          id: 'm3-1',
          sender: 'me',
          text: 'บ้านเดี่ยวที่ศุภาลัย เบลล่า ยังเปิดรับข้อเสนออยู่ไหมครับ?',
          time: '3 วันก่อน',
        },
        {
          id: 'm3-2',
          sender: 'them',
          text: 'ตอนนี้มีผู้ทำสัญญาจะซื้อจะขายแล้ว หากหลุดจองจะแจ้งคิวแรกทันทีครับ คุณได้ลงชื่อ Waitlist ไว้แล้วครับ',
          time: '3 วันก่อน',
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [inputText, setInputText] = useState<string>('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'me',
      text,
      time: 'เมื่อสักครู่',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: text,
            lastTime: 'เมื่อสักครู่',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );
    setInputText('');

    // Simulated quick reply after 1.2s
    setTimeout(() => {
      const replyMsg: Message = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: 'รับทราบครับ เดี๋ยวประสานงานและส่งรายละเอียดให้ทันทีครับ ขอบคุณครับ',
        time: 'เมื่อสักครู่',
      };
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: replyMsg.text,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas-background">
      <Navbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-muted mb-4 shrink-0">
          <Link href="/" className="hover:text-primary transition-colors">
            หน้าแรก
          </Link>
          <ChevronRight className="w-4 h-4 text-text-muted" />
          <span className="text-on-surface font-semibold">กล่องข้อความสนทนา (Chat Inbox)</span>
        </nav>

        {/* 2-Column Chat Layout (Matching S15 & S16) */}
        <div className="flex-1 bg-surface-card rounded-2xl border border-border-subtle shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[82vh]">
          {/* Left Column: Conversations List (4-5 cols) */}
          <div className="md:col-span-4 lg:col-span-4 border-r border-border-subtle flex flex-col bg-surface-card">
            {/* Inbox Header */}
            <div className="p-4 border-b border-border-subtle">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-on-surface">ข้อความทั้งหมด</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-xs font-bold">
                  {conversations.length} การสนทนา
                </span>
              </div>

              {/* Search input */}
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-text-muted absolute left-3" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้สนทนา หรือโครงการ..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-canvas-background border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
              {conversations.map((c) => {
                const isActive = c.id === activeConvId;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                      isActive ? 'bg-primary-light/50 border-l-4 border-primary' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={c.partnerAvatar}
                        alt={c.partnerName}
                        className="w-12 h-12 rounded-xl object-cover border border-border-subtle"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs sm:text-sm text-on-surface truncate">
                          {c.partnerName}
                        </span>
                        <span className="text-[11px] text-text-muted shrink-0">{c.lastTime}</span>
                      </div>

                      {/* Property mini badge */}
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-canvas-background border border-border-subtle text-[11px] text-text-muted max-w-full truncate mb-1">
                        <span className="font-medium text-primary shrink-0">{c.property.code}</span>
                        <span className="truncate">{c.property.title}</span>
                      </div>

                      <p className="text-xs text-text-muted line-clamp-1">{c.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Chat Room (8 cols) */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-canvas-background">
            {/* Chat Room Header */}
            <div className="p-4 bg-surface-card border-b border-border-subtle flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeConv.partnerAvatar}
                  alt={activeConv.partnerName}
                  className="w-10 h-10 rounded-xl object-cover border border-border-subtle shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-on-surface truncate">
                      {activeConv.partnerName}
                    </span>
                    <span className="px-2 py-0.2 rounded bg-primary-light text-primary text-[10px] font-semibold">
                      {activeConv.partnerRole === 'agent' ? 'นายหน้ายืนยันตัวตน' : 'เจ้าของขายเอง'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    กำลังใช้งาน · ตอบกลับเฉลี่ย 15 นาที
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:0814458899"
                  className="p-2 rounded-xl bg-canvas-background hover:bg-slate-100 text-primary border border-border-subtle transition-colors"
                  title="โทรออก"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Property Context Banner */}
            <div className="p-3 bg-surface-card/80 border-b border-border-subtle flex items-center justify-between gap-3 shrink-0 backdrop-blur-xs">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={activeConv.property.image}
                  alt={activeConv.property.title}
                  className="w-12 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-on-surface truncate">
                      {activeConv.property.title}
                    </span>
                    <span className="text-xs font-bold text-primary font-price shrink-0">
                      {activeConv.property.price}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted">
                    รหัสทรัพย์: {activeConv.property.code}
                  </span>
                </div>
              </div>

              <Link
                href={`/listing/${activeConv.property.code}`}
                className="px-3 py-1.5 bg-canvas-background hover:bg-surface-container text-primary font-semibold text-xs rounded-lg border border-border-subtle flex items-center gap-1 transition-colors shrink-0"
              >
                <span>ดูทรัพย์นี้</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Chat Messages Timeline */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === 'me'
                        ? 'bg-primary text-white rounded-tr-xs'
                        : 'bg-surface-card text-on-surface border border-border-subtle rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.isAppointmentAction && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>นัดหมาย: เสาร์นี้ 14:00 น.</span>
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                          ยืนยันแล้ว
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-text-muted mt-1 px-1 flex items-center gap-1">
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-teal-600" />}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Inquiry Chips */}
            <div className="px-4 py-2 bg-surface-card/60 border-t border-border-subtle flex items-center gap-2 overflow-x-auto shrink-0">
              <span className="text-[11px] text-text-muted shrink-0">คำถามด่วน:</span>
              {[
                'สนใจนัดดูห้องจริงวันเสาร์นี้',
                'ราคานี้ลดหย่อนได้อีกไหมครับ?',
                'ขอตรวจเอกสารโฉนด',
                'ขอเบอร์โทรติดต่อกลับ',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendMessage(chip)}
                  className="px-2.5 py-1 bg-surface-card hover:bg-slate-100 text-on-surface text-xs rounded-full border border-border-subtle whitespace-nowrap transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message Input Box */}
            <div className="p-3 sm:p-4 bg-surface-card border-t border-border-subtle shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  className="p-2 text-text-muted hover:text-primary transition-colors"
                  title="แนบรูปภาพ"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="พิมพ์ข้อความคุยกับผู้ดูแลทรัพย์..."
                  className="flex-1 px-4 py-2.5 text-sm bg-canvas-background border border-border-subtle rounded-xl focus:outline-none focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <span>ส่ง</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
