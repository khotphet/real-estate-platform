export interface ProvinceInfo {
  nameTh: string;
  nameEn: string;
  region: 'กรุงเทพฯ และปริมณฑล' | 'ภาคกลาง' | 'ภาคเหนือ' | 'ภาคตะวันออกเฉียงเหนือ' | 'ภาคตะวันออก' | 'ภาคใต้' | 'ภาคตะวันตก';
  lat: number;
  lng: number;
  zoom: number;
}

export const THAILAND_CENTER = {
  lat: 13.736717,
  lng: 100.523186,
  zoom: 6,
};

export const THAILAND_PROVINCES: ProvinceInfo[] = [
  // กรุงเทพฯ และปริมณฑล
  { nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok', region: 'กรุงเทพฯ และปริมณฑล', lat: 13.7563, lng: 100.5018, zoom: 12 },
  { nameTh: 'นนทบุรี', nameEn: 'Nonthaburi', region: 'กรุงเทพฯ และปริมณฑล', lat: 13.8591, lng: 100.5217, zoom: 12 },
  { nameTh: 'ปทุมธานี', nameEn: 'Pathum Thani', region: 'กรุงเทพฯ และปริมณฑล', lat: 14.0208, lng: 100.5250, zoom: 12 },
  { nameTh: 'สมุทรปราการ', nameEn: 'Samut Prakan', region: 'กรุงเทพฯ และปริมณฑล', lat: 13.5991, lng: 100.5998, zoom: 12 },
  { nameTh: 'สมุทรสาคร', nameEn: 'Samut Sakhon', region: 'กรุงเทพฯ และปริมณฑล', lat: 13.5475, lng: 100.2744, zoom: 12 },
  { nameTh: 'นครปฐม', nameEn: 'Nakhon Pathom', region: 'กรุงเทพฯ และปริมณฑล', lat: 13.8196, lng: 100.0373, zoom: 12 },

  // ภาคกลาง
  { nameTh: 'พระนครศรีอยุธยา', nameEn: 'Phra Nakhon Si Ayutthaya', region: 'ภาคกลาง', lat: 14.3532, lng: 100.5684, zoom: 12 },
  { nameTh: 'อ่างทอง', nameEn: 'Ang Thong', region: 'ภาคกลาง', lat: 14.5896, lng: 100.4550, zoom: 12 },
  { nameTh: 'ลพบุรี', nameEn: 'Lop Buri', region: 'ภาคกลาง', lat: 14.7995, lng: 100.6534, zoom: 12 },
  { nameTh: 'สิงห์บุรี', nameEn: 'Sing Buri', region: 'ภาคกลาง', lat: 14.8879, lng: 100.4035, zoom: 12 },
  { nameTh: 'ชัยนาท', nameEn: 'Chai Nat', region: 'ภาคกลาง', lat: 15.1852, lng: 100.1252, zoom: 12 },
  { nameTh: 'สระบุรี', nameEn: 'Saraburi', region: 'ภาคกลาง', lat: 14.5289, lng: 100.9101, zoom: 12 },
  { nameTh: 'สุพรรณบุรี', nameEn: 'Suphan Buri', region: 'ภาคกลาง', lat: 14.4745, lng: 100.1177, zoom: 12 },

  // ภาคเหนือ
  { nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai', region: 'ภาคเหนือ', lat: 18.7883, lng: 98.9853, zoom: 12 },
  { nameTh: 'เชียงราย', nameEn: 'Chiang Rai', region: 'ภาคเหนือ', lat: 19.9105, lng: 99.8406, zoom: 12 },
  { nameTh: 'ลำปาง', nameEn: 'Lampang', region: 'ภาคเหนือ', lat: 18.2888, lng: 99.4928, zoom: 12 },
  { nameTh: 'ลำพูน', nameEn: 'Lamphun', region: 'ภาคเหนือ', lat: 18.5772, lng: 99.0087, zoom: 12 },
  { nameTh: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son', region: 'ภาคเหนือ', lat: 19.3020, lng: 97.9654, zoom: 12 },
  { nameTh: 'น่าน', nameEn: 'Nan', region: 'ภาคเหนือ', lat: 18.7831, lng: 100.7782, zoom: 12 },
  { nameTh: 'พะเยา', nameEn: 'Phayao', region: 'ภาคเหนือ', lat: 19.1664, lng: 99.9022, zoom: 12 },
  { nameTh: 'แพร่', nameEn: 'Phrae', region: 'ภาคเหนือ', lat: 18.1446, lng: 100.1411, zoom: 12 },
  { nameTh: 'อุตรดิตถ์', nameEn: 'Uttaradit', region: 'ภาคเหนือ', lat: 17.6201, lng: 100.0993, zoom: 12 },
  { nameTh: 'พิษณุโลก', nameEn: 'Phitsanulok', region: 'ภาคเหนือ', lat: 16.8211, lng: 100.2659, zoom: 12 },
  { nameTh: 'สุโขทัย', nameEn: 'Sukhothai', region: 'ภาคเหนือ', lat: 17.0078, lng: 99.8234, zoom: 12 },
  { nameTh: 'เพชรบูรณ์', nameEn: 'Phetchabun', region: 'ภาคเหนือ', lat: 16.4190, lng: 101.1567, zoom: 12 },
  { nameTh: 'พิจิตร', nameEn: 'Phichit', region: 'ภาคเหนือ', lat: 16.4429, lng: 100.3490, zoom: 12 },
  { nameTh: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet', region: 'ภาคเหนือ', lat: 16.4828, lng: 99.5227, zoom: 12 },
  { nameTh: 'นครสวรรค์', nameEn: 'Nakhon Sawan', region: 'ภาคเหนือ', lat: 15.6987, lng: 100.1199, zoom: 12 },
  { nameTh: 'อุทัยธานี', nameEn: 'Uthai Thani', region: 'ภาคเหนือ', lat: 15.3835, lng: 100.0245, zoom: 12 },

  // ภาคตะวันออกเฉียงเหนือ
  { nameTh: 'อุดรธานี', nameEn: 'Udon Thani', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.4138, lng: 102.7872, zoom: 13 },
  { nameTh: 'ขอนแก่น', nameEn: 'Khon Kaen', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.4322, lng: 102.8236, zoom: 12 },
  { nameTh: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 14.9799, lng: 102.0977, zoom: 12 },
  { nameTh: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.2448, lng: 104.8473, zoom: 12 },
  { nameTh: 'บุรีรัมย์', nameEn: 'Buri Ram', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 14.9930, lng: 103.1029, zoom: 12 },
  { nameTh: 'สุรินทร์', nameEn: 'Surin', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 14.8818, lng: 103.4936, zoom: 12 },
  { nameTh: 'ศรีสะเกษ', nameEn: 'Si Sa Ket', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.1186, lng: 104.3220, zoom: 12 },
  { nameTh: 'ร้อยเอ็ด', nameEn: 'Roi Et', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.0538, lng: 103.6520, zoom: 12 },
  { nameTh: 'ชัยภูมิ', nameEn: 'Chaiyaphum', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.8105, lng: 102.0315, zoom: 12 },
  { nameTh: 'สกลนคร', nameEn: 'Sakon Nakhon', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.1664, lng: 104.1486, zoom: 12 },
  { nameTh: 'กาฬสินธุ์', nameEn: 'Kalasin', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.4328, lng: 103.5067, zoom: 12 },
  { nameTh: 'มหาสารคาม', nameEn: 'Maha Sarakham', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.1852, lng: 103.3007, zoom: 12 },
  { nameTh: 'หนองคาย', nameEn: 'Nong Khai', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.8783, lng: 102.7420, zoom: 12 },
  { nameTh: 'ยโสธร', nameEn: 'Yasothon', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.7926, lng: 104.1451, zoom: 12 },
  { nameTh: 'หนองบัวลำภู', nameEn: 'Nong Bua Lam Phu', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.2043, lng: 102.4407, zoom: 12 },
  { nameTh: 'เลย', nameEn: 'Loei', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.4860, lng: 101.7223, zoom: 12 },
  { nameTh: 'นครพนม', nameEn: 'Nakhon Phanom', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 17.4069, lng: 104.7816, zoom: 12 },
  { nameTh: 'มุกดาหาร', nameEn: 'Mukdahan', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 16.5436, lng: 104.7235, zoom: 12 },
  { nameTh: 'บึงกาฬ', nameEn: 'Bueng Kan', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 18.3633, lng: 103.6528, zoom: 12 },
  { nameTh: 'อำนาจเจริญ', nameEn: 'Amnat Charoen', region: 'ภาคตะวันออกเฉียงเหนือ', lat: 15.8657, lng: 104.6258, zoom: 12 },

  // ภาคตะวันออก
  { nameTh: 'ชลบุรี', nameEn: 'Chon Buri', region: 'ภาคตะวันออก', lat: 13.3611, lng: 100.9847, zoom: 12 },
  { nameTh: 'ระยอง', nameEn: 'Rayong', region: 'ภาคตะวันออก', lat: 12.6814, lng: 101.2816, zoom: 12 },
  { nameTh: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao', region: 'ภาคตะวันออก', lat: 13.6904, lng: 101.0779, zoom: 12 },
  { nameTh: 'จันทบุรี', nameEn: 'Chanthaburi', region: 'ภาคตะวันออก', lat: 12.6114, lng: 102.1039, zoom: 12 },
  { nameTh: 'ตราด', nameEn: 'Trat', region: 'ภาคตะวันออก', lat: 12.2428, lng: 102.5175, zoom: 12 },
  { nameTh: 'ปราจีนบุรี', nameEn: 'Prachin Buri', region: 'ภาคตะวันออก', lat: 14.0509, lng: 101.3716, zoom: 12 },
  { nameTh: 'นครนายก', nameEn: 'Nakhon Nayok', region: 'ภาคตะวันออก', lat: 14.2069, lng: 101.2131, zoom: 12 },
  { nameTh: 'สระแก้ว', nameEn: 'Sa Kaeo', region: 'ภาคตะวันออก', lat: 13.8140, lng: 102.0583, zoom: 12 },

  // ภาคใต้
  { nameTh: 'ภูเก็ต', nameEn: 'Phuket', region: 'ภาคใต้', lat: 7.8804, lng: 98.3923, zoom: 12 },
  { nameTh: 'สงขลา', nameEn: 'Songkhla', region: 'ภาคใต้', lat: 7.1756, lng: 100.6143, zoom: 12 },
  { nameTh: 'สุราษฎร์ธานี', nameEn: 'Surat Thani', region: 'ภาคใต้', lat: 9.1382, lng: 99.3217, zoom: 12 },
  { nameTh: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat', region: 'ภาคใต้', lat: 8.4304, lng: 99.9631, zoom: 12 },
  { nameTh: 'กระบี่', nameEn: 'Krabi', region: 'ภาคใต้', lat: 8.0863, lng: 98.9063, zoom: 12 },
  { nameTh: 'พังงา', nameEn: 'Phangnga', region: 'ภาคใต้', lat: 8.4501, lng: 98.5255, zoom: 12 },
  { nameTh: 'ตรัง', nameEn: 'Trang', region: 'ภาคใต้', lat: 7.5563, lng: 99.6114, zoom: 12 },
  { nameTh: 'ชุมพร', nameEn: 'Chumphon', region: 'ภาคใต้', lat: 10.4930, lng: 99.1800, zoom: 12 },
  { nameTh: 'ระนอง', nameEn: 'Ranong', region: 'ภาคใต้', lat: 9.9529, lng: 98.6348, zoom: 12 },
  { nameTh: 'พัทลุง', nameEn: 'Phatthalung', region: 'ภาคใต้', lat: 7.6167, lng: 100.0833, zoom: 12 },
  { nameTh: 'สตูล', nameEn: 'Satun', region: 'ภาคใต้', lat: 6.6238, lng: 100.0674, zoom: 12 },
  { nameTh: 'ปัตตานี', nameEn: 'Pattani', region: 'ภาคใต้', lat: 6.8696, lng: 101.2501, zoom: 12 },
  { nameTh: 'ยะลา', nameEn: 'Yala', region: 'ภาคใต้', lat: 6.5411, lng: 101.2804, zoom: 12 },
  { nameTh: 'นราธิวาส', nameEn: 'Narathiwat', region: 'ภาคใต้', lat: 6.4255, lng: 101.8253, zoom: 12 },

  // ภาคตะวันตก
  { nameTh: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan', region: 'ภาคตะวันตก', lat: 11.8124, lng: 99.7972, zoom: 12 },
  { nameTh: 'เพชรบุรี', nameEn: 'Phetchaburi', region: 'ภาคตะวันตก', lat: 13.1119, lng: 99.9392, zoom: 12 },
  { nameTh: 'กาญจนบุรี', nameEn: 'Kanchanaburi', region: 'ภาคตะวันตก', lat: 14.0228, lng: 99.5328, zoom: 12 },
  { nameTh: 'ราชบุรี', nameEn: 'Ratchaburi', region: 'ภาคตะวันตก', lat: 13.5283, lng: 99.8134, zoom: 12 },
  { nameTh: 'ตาก', nameEn: 'Tak', region: 'ภาคตะวันตก', lat: 16.8837, lng: 99.1258, zoom: 12 },
];

export const REGIONS = [
  'ทุกภาค',
  'กรุงเทพฯ และปริมณฑล',
  'ภาคกลาง',
  'ภาคเหนือ',
  'ภาคตะวันออกเฉียงเหนือ',
  'ภาคตะวันออก',
  'ภาคใต้',
  'ภาคตะวันตก',
] as const;

export function getProvinceByName(name: string): ProvinceInfo | undefined {
  return THAILAND_PROVINCES.find((p) => p.nameTh === name || p.nameEn.toLowerCase() === name.toLowerCase());
}
