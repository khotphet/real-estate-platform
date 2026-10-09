import { notFound } from 'next/navigation';
import { AgentClientView, AgentProfile } from '@/components/agent/AgentClientView';

const AGENTS_DATABASE: Record<string, AgentProfile> = {
  somying: {
    id: 'somying',
    name: 'คุณสมหญิง บุญรักษา',
    roleTitle: 'ตัวแทนนายหน้ามืออาชีพระดับเหรียญทอง (Verified Agent Pro)',
    agency: 'Udon Premier Realty Co., Ltd.',
    licenseNo: 'TREBA-UD-2024-8891 (สมาคมนายหน้าอสังหาริมทรัพย์ไทย)',
    phone: '081-882-9901',
    lineId: '@somying.udon',
    email: 'somying@udonpremierrealty.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 28,
    closedDeals: 42,
    experienceYears: 8,
    bio: 'ผู้เชี่ยวชาญการซื้อ-ขาย-เช่าอสังหาริมทรัพย์ในจังหวัดอุดรธานี โดยเฉพาะทำเลรอบสวนสาธารณะหนองประจักษ์, เซ็นทรัลพลาซา, และย่านการค้า UD Town มีความเชี่ยวชาญด้านสินเชื่อธนาคารและการตรวจสอบโฉนดที่ดิน ยินดีร่วมงานแบบ Co-Broker 50/50 กับเพื่อนร่วมวิชาชีพทุกท่านค่ะ',
    zones: ['รอบสวนหนองประจักษ์', 'เซ็นทรัล / UD Town', 'โซนสนามบินอุดร', 'ต.หมากแข้ง', 'บ้านเลื่อม'],
  },
  thanakrit: {
    id: 'thanakrit',
    name: 'ธนกฤต วรวิทย์คุณากร',
    roleTitle: 'ตัวแทนที่ปรึกษาด้านการลงทุนอสังหาริมทรัพย์',
    agency: 'Isan Property Alliance',
    licenseNo: 'TREBA-UD-2023-4120',
    phone: '081-445-8899',
    lineId: '@thanakrit.udon',
    email: 'thanakrit@isanproperty.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 28,
    closedDeals: 31,
    experienceYears: 6,
    bio: 'เน้นคอนโดและที่ดินโซนรอบเมืองอุดรธานี ให้คำปรึกษาการประเมินราคาธนาคาร',
    zones: ['โซนรอบเมืองเลี่ยงเมือง', 'หนองสำโรง', 'บ้านเลื่อม', 'ถ.มิตรภาพ'],
  },
};

const ALIASES: Record<string, string> = {
  'somying-boonraksa': 'somying',
  'thanakrit-worawit': 'thanakrit',
};

function getAgent(rawId: string): AgentProfile | null {
  const normalized = ALIASES[rawId] || rawId;
  return AGENTS_DATABASE[normalized] || null;
}

export async function generateStaticParams() {
  return [
    { id: 'somying' },
    { id: 'somying-boonraksa' },
    { id: 'thanakrit' },
    { id: 'thanakrit-worawit' },
  ];
}

export default async function AgentMicrositePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = getAgent(id);
  if (!agent) {
    notFound();
  }
  return <AgentClientView agent={agent} />;
}
