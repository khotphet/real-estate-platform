export interface DemandPin {
  id: string;
  code: string;
  buyerName: string;
  buyerAvatar: string;
  buyerPhoneMasked: string;
  dealType: 'buy' | 'rent';
  propertyType: 'detached_house' | 'condo' | 'townhome' | 'land' | 'commercial';
  propertyTypeLabel: string;
  budgetMin: number;
  budgetMax: number;
  budgetFormatted: string;
  targetZone: string;
  lat: number;
  lng: number;
  requirements: string[];
  description: string;
  urgency: 'immediate' | 'within_1_month' | 'within_3_months';
  urgencyLabel: string;
  offersCount: number;
  createdAt: string;
}

export const MOCK_DEMANDS: DemandPin[] = [
  {
    id: 'dm-001',
    code: 'DM-UD-801',
    buyerName: 'คุณกฤษฎา (แพทย์ รพ.ศูนย์อุดร)',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    buyerPhoneMasked: '081-456-XXXX',
    dealType: 'buy',
    propertyType: 'detached_house',
    propertyTypeLabel: 'บ้านเดี่ยว',
    budgetMin: 4500000,
    budgetMax: 6500000,
    budgetFormatted: '฿4.5M – ฿6.5M',
    targetZone: 'รอบสวนสาธารณะหนองประจักษ์ / โพศรี',
    lat: 17.421,
    lng: 102.784,
    requirements: ['3-4 ห้องนอน', 'ที่จอดรถ 2 คันขึ้นไป', 'เนื้อที่ 60 ตร.ว. ขึ้นไป', 'เดินทางไป รพ. สะดวก'],
    description: 'มองหาบ้านเดี่ยวสภาพดีหรือมือหนึ่ง ใกล้สวนหนองประจักษ์หรือเข้าออก ถ.โพศรี ได้สะดวก เพื่อความสะดวกในการเดินทางไปทำงานที่ รพ.ศูนย์อุดรธานี พร้อมทำสัญญาและยื่นกู้ทันที',
    urgency: 'within_1_month',
    urgencyLabel: 'ต้องการภายใน 1 เดือน',
    offersCount: 4,
    createdAt: '2 วันที่แล้ว',
  },
  {
    id: 'dm-002',
    code: 'DM-UD-802',
    buyerName: 'คุณปรียานุช (เจ้าของธุรกิจ UD Town)',
    buyerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    buyerPhoneMasked: '089-771-XXXX',
    dealType: 'rent',
    propertyType: 'condo',
    propertyTypeLabel: 'คอนโดมิเนียม',
    budgetMin: 9000,
    budgetMax: 15000,
    budgetFormatted: '฿9,000 – ฿15,000 / ด.',
    targetZone: 'ใกล้เซ็นทรัล / UD Town / สถานีรถไฟ',
    lat: 17.405,
    lng: 102.802,
    requirements: ['1-2 ห้องนอน', 'พร้อมเฟอร์นิเจอร์ + เครื่องซักผ้า', 'ที่จอดรถ 1 คัน', 'มีฟิตเนส/สระ'],
    description: 'ต้องการเช่าคอนโดสัญญา 1 ปี ใกล้โซน UD Town หรือเซ็นทรัลอุดร สามารถเดินไปทำงานได้ ขอห้องสะอาด ดูแลรักษาอย่างดี พร้อมเข้าอยู่ต้นเดือนหน้า',
    urgency: 'immediate',
    urgencyLabel: 'พร้อมเข้าอยู่ทันที',
    offersCount: 7,
    createdAt: 'เมื่อวานนี้',
  },
  {
    id: 'dm-003',
    code: 'DM-UD-803',
    buyerName: 'คุณธนภัทร (นักลงทุนอสังหาฯ)',
    buyerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    buyerPhoneMasked: '082-990-XXXX',
    dealType: 'buy',
    propertyType: 'commercial',
    propertyTypeLabel: 'อาคารพาณิชย์',
    budgetMin: 6000000,
    budgetMax: 12000000,
    budgetFormatted: '฿6.0M – ฿12.0M',
    targetZone: 'ถ.ประจักษ์ศิลปาคม / ย่านธุรกิจหมากแข้ง',
    lat: 17.412,
    lng: 102.791,
    requirements: ['3-4 ชั้น', 'หน้ากว้าง 4.5 ม. ขึ้นไป', 'ติดถนนใหญ่หรือคนพลุกพล่าน', 'มีที่จอดรถหน้าร้าน'],
    description: 'หาตึกแถว/อาคารพาณิชย์สำหรับเปิดคลินิกเสริมความงามหรือสำนักงาน โซนตัวเมืองอุดรฯ หมากแข้ง มีที่จอดรถสะดวก รับพิจารณาตึกมือสองสภาพดี',
    urgency: 'within_3_months',
    urgencyLabel: 'ภายใน 3 เดือน',
    offersCount: 2,
    createdAt: '4 วันที่แล้ว',
  },
  {
    id: 'dm-004',
    code: 'DM-UD-804',
    buyerName: 'คุณวรรณวิสา (ข้าราชการย้ายมาอุดรฯ)',
    buyerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    buyerPhoneMasked: '086-332-XXXX',
    dealType: 'buy',
    propertyType: 'townhome',
    propertyTypeLabel: 'ทาวน์โฮม',
    budgetMin: 2200000,
    budgetMax: 3200000,
    budgetFormatted: '฿2.2M – ฿3.2M',
    targetZone: 'โซนสนามบิน / ถ.ทหาร / ค่ายประจักษ์',
    lat: 17.391,
    lng: 102.782,
    requirements: ['3 ห้องนอน 2 ห้องน้ำ', 'หน้ากว้าง 5.5 ม.', 'จอดรถ 2 คัน', 'สังคมสงบ ปลอดภัย'],
    description: 'ย้ายมารับราชการที่อุดรธานี ต้องการทาวน์โฮม 2 ชั้น โซนใกล้สนามบินหรือ ถ.ทหาร เพื่อสะดวกในการเดินทาง บรรยากาศเงียบสงบ มี รปภ.',
    urgency: 'within_1_month',
    urgencyLabel: 'ต้องการภายใน 1 เดือน',
    offersCount: 5,
    createdAt: '5 วันที่แล้ว',
  },
  {
    id: 'dm-005',
    code: 'DM-UD-805',
    buyerName: 'ครอบครัวชินวัตร (สร้างบ้านอยู่อาศัย)',
    buyerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    buyerPhoneMasked: '085-112-XXXX',
    dealType: 'buy',
    propertyType: 'land',
    propertyTypeLabel: 'ที่ดินเปล่า',
    budgetMin: 2500000,
    budgetMax: 4500000,
    budgetFormatted: '฿2.5M – ฿4.5M',
    targetZone: 'บ้านเลื่อม / หนองสำโรง / รอบเมือง',
    lat: 17.435,
    lng: 102.768,
    requirements: ['ขนาด 100 - 200 ตร.ว.', 'โฉนดครุฑแดง น.ส.4 จ.', 'มีน้ำประปา ไฟฟ้าเข้าถึง', 'ติดถนนคอนกรีต'],
    description: 'ต้องการที่ดินเปล่าเพื่อสร้างบ้านเดี่ยวพักผ่อน ขอที่ดินถมแล้วหรือเสมอถนน ไม่เปลี่ยว บรรยากาศร่มรื่น ติดถนนสาธารณะ',
    urgency: 'within_3_months',
    urgencyLabel: 'ภายใน 3 เดือน',
    offersCount: 3,
    createdAt: '1 สัปดาห์ที่แล้ว',
  },
];
