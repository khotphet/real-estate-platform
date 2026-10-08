-- =====================================================================
-- MapNest database schema · PostgreSQL 16 + PostGIS 3.4 (Supabase)
-- GENERATED from scratch/db_data.py — do not edit by hand
-- 53 tables · 528 columns · 93 FKs (49 cross-module) · 76 indexes · 15 table checks
-- =====================================================================
BEGIN;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE SCHEMA IF NOT EXISTS m1_identity;
COMMENT ON SCHEMA m1_identity IS 'M1 ผู้ใช้ & สิทธิ์ — บัญชี · บทบาท · ล็อกอิน · KYC · ความยินยอม PDPA · ทีม';
CREATE SCHEMA IF NOT EXISTS m2_listing;
COMMENT ON SCHEMA m2_listing IS 'M2 ประกาศ — ประกาศ · โครงการ · ยูนิต · รูป · เอกสาร · ประวัติสถานะ · สถิติ';
CREATE SCHEMA IF NOT EXISTS m3_discovery;
COMMENT ON SCHEMA m3_discovery IS 'M3 ค้นหา — ตารางค้นหา (read model) · รายการโปรด · คิวรอ · สินเชื่อ';
CREATE SCHEMA IF NOT EXISTS m4_engage;
COMMENT ON SCHEMA m4_engage IS 'M4 จับคู่ & แชท — ความต้องการ · จับคู่ · เสนอทรัพย์ · Agent Hub · แชท · นัดดู · รีวิว';
CREATE SCHEMA IF NOT EXISTS m5_commerce;
COMMENT ON SCHEMA m5_commerce IS 'M5 ชำระเงิน — แพ็กเกจ · คูปอง · ตะกร้า · ออเดอร์ · Webhook · คืนเงิน · สิทธิ์ใช้งาน';
CREATE SCHEMA IF NOT EXISTS core;
COMMENT ON SCHEMA core IS 'core ข้อมูลกลาง — พื้นที่ปกครอง · แลนด์มาร์ก · Outbox · แจ้งเตือน · รายงาน · Audit · ค่าระบบ';

CREATE OR REPLACE FUNCTION core.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

-- พื้นที่ปกครอง
CREATE TABLE core.admin_areas (
  code text PRIMARY KEY,
  level text NOT NULL CHECK (level IN ('province', 'district', 'subdistrict')),
  parent_code text,
  name_th text NOT NULL,
  name_en text,
  postcode text,
  centroid geography(Point,4326),
  boundary geography(MultiPolygon,4326)
);
COMMENT ON TABLE core.admin_areas IS 'พื้นที่ปกครอง — จังหวัด / อำเภอ / ตำบล ทั้งประเทศ (นำร่องนำเข้าอุดรธานีก่อน) ใช้กรองค้นหาและแสดงชื่อพื้นที่';
COMMENT ON COLUMN core.admin_areas.code IS 'รหัสกรมการปกครอง: จังหวัด 2 หลัก · อำเภอ 4 · ตำบล 6';
COMMENT ON COLUMN core.admin_areas.level IS 'ระดับพื้นที่';
COMMENT ON COLUMN core.admin_areas.parent_code IS 'พื้นที่แม่ (ตำบล ➜ อำเภอ ➜ จังหวัด)';
COMMENT ON COLUMN core.admin_areas.name_th IS 'ชื่อภาษาไทย';
COMMENT ON COLUMN core.admin_areas.name_en IS 'ชื่อภาษาอังกฤษ';
COMMENT ON COLUMN core.admin_areas.postcode IS 'รหัสไปรษณีย์ (ระดับตำบล)';
COMMENT ON COLUMN core.admin_areas.centroid IS 'จุดกึ่งกลาง ใช้ซูมแผนที่';
COMMENT ON COLUMN core.admin_areas.boundary IS 'เส้นขอบเขต ใช้ระบุพื้นที่จากพิกัด';
CREATE INDEX admin_areas_parent_idx ON core.admin_areas (parent_code);
CREATE INDEX admin_areas_boundary_gix ON core.admin_areas USING gist (boundary);
CREATE INDEX admin_areas_name_trgm ON core.admin_areas USING gin (name_th gin_trgm_ops);
ALTER TABLE core.admin_areas ENABLE ROW LEVEL SECURITY;

-- แลนด์มาร์ก
CREATE TABLE core.landmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_th text NOT NULL,
  category text NOT NULL CHECK (category IN ('university', 'hospital', 'mall', 'school', 'transport', 'government', 'other')),
  location geography(Point,4326) NOT NULL,
  subdistrict_code text,
  aliases text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE core.landmarks IS 'แลนด์มาร์ก — จุดอ้างอิงยอดนิยม (มหาวิทยาลัย โรงพยาบาล ห้าง) ใช้ค้นหา "ใกล้..." และตั้งความต้องการ';
COMMENT ON COLUMN core.landmarks.id IS 'รหัส (UUID)';
COMMENT ON COLUMN core.landmarks.name_th IS 'ชื่อสถานที่';
COMMENT ON COLUMN core.landmarks.category IS 'ประเภท';
COMMENT ON COLUMN core.landmarks.location IS 'พิกัด';
COMMENT ON COLUMN core.landmarks.subdistrict_code IS 'ตำบลที่ตั้ง';
COMMENT ON COLUMN core.landmarks.aliases IS 'ชื่อเรียกอื่น เช่น มรภ.อุดร';
COMMENT ON COLUMN core.landmarks.created_at IS 'เวลาสร้าง';
CREATE INDEX landmarks_location_gix ON core.landmarks USING gist (location);
CREATE INDEX landmarks_name_trgm ON core.landmarks USING gin (name_th gin_trgm_ops);
ALTER TABLE core.landmarks ENABLE ROW LEVEL SECURITY;

-- Outbox เหตุการณ์
CREATE TABLE core.outbox_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  attempts int NOT NULL DEFAULT 0,
  last_error text
);
COMMENT ON TABLE core.outbox_events IS 'Outbox เหตุการณ์ — Event ที่เขียนในธุรกรรมเดียวกับข้อมูล แล้วงาน outbox.relay ส่งเข้าคิว (กัน Event หาย)';
COMMENT ON COLUMN core.outbox_events.id IS 'รหัสเลขรัน (bigint)';
COMMENT ON COLUMN core.outbox_events.event_type IS 'ชื่อ Event เช่น ListingPublished (EV-02)';
COMMENT ON COLUMN core.outbox_events.aggregate_type IS 'ชนิดข้อมูลต้นเรื่อง เช่น listing';
COMMENT ON COLUMN core.outbox_events.aggregate_id IS 'รหัสข้อมูลต้นเรื่อง';
COMMENT ON COLUMN core.outbox_events.payload IS 'ข้อมูลประกอบ Event';
COMMENT ON COLUMN core.outbox_events.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN core.outbox_events.published_at IS 'เวลาส่งเข้าคิวสำเร็จ (NULL = ค้างส่ง)';
COMMENT ON COLUMN core.outbox_events.attempts IS 'จำนวนครั้งที่พยายามส่ง';
COMMENT ON COLUMN core.outbox_events.last_error IS 'ข้อผิดพลาดล่าสุด';
CREATE INDEX outbox_events_unpublished_idx ON core.outbox_events (id) WHERE published_at IS NULL;
ALTER TABLE core.outbox_events ENABLE ROW LEVEL SECURITY;

-- การแจ้งเตือน
CREATE TABLE core.notifications (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('match', 'proposal', 'chat', 'appointment', 'listing', 'kyc', 'payment', 'waitlist', 'system')),
  title text NOT NULL,
  body text,
  link_url text,
  data jsonb NOT NULL DEFAULT '{}',
  read_at timestamptz,
  pushed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE core.notifications IS 'การแจ้งเตือน — กล่องแจ้งเตือนในแอป (หน้า S05) + บันทึกการส่ง Web Push';
COMMENT ON COLUMN core.notifications.id IS 'รหัสเลขรัน (bigint)';
COMMENT ON COLUMN core.notifications.user_id IS 'ผู้รับ';
COMMENT ON COLUMN core.notifications.kind IS 'หมวดแจ้งเตือน';
COMMENT ON COLUMN core.notifications.title IS 'หัวข้อ';
COMMENT ON COLUMN core.notifications.body IS 'ข้อความ';
COMMENT ON COLUMN core.notifications.link_url IS 'ลิงก์ในแอปเมื่อกด';
COMMENT ON COLUMN core.notifications.data IS 'ข้อมูลประกอบ';
COMMENT ON COLUMN core.notifications.read_at IS 'เวลาอ่าน (NULL = ยังไม่อ่าน)';
COMMENT ON COLUMN core.notifications.pushed_at IS 'เวลาส่ง Web Push';
COMMENT ON COLUMN core.notifications.created_at IS 'เวลาสร้าง';
CREATE INDEX notifications_user_created_idx ON core.notifications (user_id, created_at DESC);
CREATE INDEX notifications_unread_idx ON core.notifications (user_id) WHERE read_at IS NULL;
ALTER TABLE core.notifications ENABLE ROW LEVEL SECURITY;

-- รายงานปัญหา
CREATE TABLE core.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id uuid,
  target_type text NOT NULL CHECK (target_type IN ('listing', 'user', 'message', 'review', 'proposal')),
  target_id text NOT NULL,
  reason text NOT NULL CHECK (reason IN ('fake', 'sold', 'wrong_info', 'scam', 'spam', 'offensive', 'duplicate', 'other')),
  detail text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'actioned', 'dismissed')),
  resolved_by uuid,
  resolution_note text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE core.reports IS 'รายงานปัญหา — ผู้ใช้แจ้งประกาศ/ผู้ใช้/ข้อความไม่เหมาะสม ➜ คิวตรวจของแอดมิน (S64)';
COMMENT ON COLUMN core.reports.id IS 'รหัส (UUID)';
COMMENT ON COLUMN core.reports.reporter_user_id IS 'ผู้แจ้ง';
COMMENT ON COLUMN core.reports.target_type IS 'ชนิดสิ่งที่ถูกแจ้ง';
COMMENT ON COLUMN core.reports.target_id IS 'รหัสสิ่งที่ถูกแจ้ง';
COMMENT ON COLUMN core.reports.reason IS 'เหตุผล';
COMMENT ON COLUMN core.reports.detail IS 'รายละเอียดเพิ่มเติม';
COMMENT ON COLUMN core.reports.status IS 'สถานะการตรวจ';
COMMENT ON COLUMN core.reports.resolved_by IS 'แอดมินผู้ตัดสิน';
COMMENT ON COLUMN core.reports.resolution_note IS 'บันทึกการตัดสิน';
COMMENT ON COLUMN core.reports.resolved_at IS 'เวลาตัดสิน';
COMMENT ON COLUMN core.reports.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN core.reports.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE INDEX reports_status_idx ON core.reports (status, created_at);
CREATE INDEX reports_target_idx ON core.reports (target_type, target_id);
CREATE TRIGGER reports_set_updated_at BEFORE UPDATE ON core.reports FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE core.reports ENABLE ROW LEVEL SECURITY;

-- บันทึกตรวจสอบ
CREATE TABLE core.audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_user_id uuid,
  action text NOT NULL,
  target_type text,
  target_id text,
  ip inet,
  user_agent text,
  meta jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE core.audit_logs IS 'บันทึกตรวจสอบ — บันทึกการกระทำสำคัญแบบเพิ่มอย่างเดียว: กดดูเบอร์ · อนุมัติ KYC · ซ่อนประกาศ · คืนเงิน · แก้ค่าระบบ';
COMMENT ON COLUMN core.audit_logs.id IS 'รหัสเลขรัน (bigint)';
COMMENT ON COLUMN core.audit_logs.actor_user_id IS 'ผู้กระทำ (NULL = ระบบ)';
COMMENT ON COLUMN core.audit_logs.action IS 'การกระทำ เช่น phone.reveal · kyc.approve · listing.hide';
COMMENT ON COLUMN core.audit_logs.target_type IS 'ชนิดเป้าหมาย';
COMMENT ON COLUMN core.audit_logs.target_id IS 'รหัสเป้าหมาย';
COMMENT ON COLUMN core.audit_logs.ip IS 'IP ผู้กระทำ';
COMMENT ON COLUMN core.audit_logs.user_agent IS 'เบราว์เซอร์';
COMMENT ON COLUMN core.audit_logs.meta IS 'รายละเอียด (ค่าก่อน/หลัง)';
COMMENT ON COLUMN core.audit_logs.created_at IS 'เวลาสร้าง';
CREATE INDEX audit_logs_actor_idx ON core.audit_logs (actor_user_id, created_at DESC);
CREATE INDEX audit_logs_target_idx ON core.audit_logs (target_type, target_id);
ALTER TABLE core.audit_logs ENABLE ROW LEVEL SECURITY;

-- ค่าระบบ
CREATE TABLE core.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE core.settings IS 'ค่าระบบ — ค่าที่แอดมินปรับได้โดยไม่แก้โค้ด เช่น free_listing_quota = 2 · kyc_sla_hours = 24 · listing_freshness_days = 30';
COMMENT ON COLUMN core.settings.key IS 'ชื่อค่า';
COMMENT ON COLUMN core.settings.value IS 'ค่า';
COMMENT ON COLUMN core.settings.description IS 'คำอธิบาย';
COMMENT ON COLUMN core.settings.updated_by IS 'แอดมินผู้แก้ล่าสุด';
COMMENT ON COLUMN core.settings.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE TRIGGER settings_set_updated_at BEFORE UPDATE ON core.settings FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE core.settings ENABLE ROW LEVEL SECURITY;

-- ผู้ใช้
CREATE TABLE m1_identity.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  email citext UNIQUE,
  phone_e164 text UNIQUE CHECK (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  phone_verified_at timestamptz,
  avatar_url text,
  locale text NOT NULL DEFAULT 'th' CHECK (locale IN ('th', 'en')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'deleted')),
  settings jsonb NOT NULL DEFAULT '{}',
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);
COMMENT ON TABLE m1_identity.users IS 'ผู้ใช้ — บัญชีผู้ใช้ 1 คน = 1 แถว มีได้หลายบทบาท (user_roles) · ลบแบบ soft delete แล้วลบข้อมูลส่วนตัวตาม PDPA';
COMMENT ON COLUMN m1_identity.users.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m1_identity.users.display_name IS 'ชื่อที่แสดง';
COMMENT ON COLUMN m1_identity.users.email IS 'อีเมล (ไม่สนตัวพิมพ์)';
COMMENT ON COLUMN m1_identity.users.phone_e164 IS 'เบอร์โทรรูปแบบ +66… (ยืนยัน OTP แล้ว)';
COMMENT ON COLUMN m1_identity.users.phone_verified_at IS 'เวลายืนยัน OTP';
COMMENT ON COLUMN m1_identity.users.avatar_url IS 'รูปโปรไฟล์';
COMMENT ON COLUMN m1_identity.users.locale IS 'ภาษา';
COMMENT ON COLUMN m1_identity.users.status IS 'สถานะบัญชี';
COMMENT ON COLUMN m1_identity.users.settings IS 'ค่าส่วนตัว เช่น search_view = map/list (จำมุมมองล่าสุด) · การแจ้งเตือน';
COMMENT ON COLUMN m1_identity.users.last_seen_at IS 'ใช้งานล่าสุด';
COMMENT ON COLUMN m1_identity.users.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m1_identity.users.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
COMMENT ON COLUMN m1_identity.users.deleted_at IS 'ลบแบบ soft delete (NULL = ยังใช้งาน)';
CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON m1_identity.users FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m1_identity.users ENABLE ROW LEVEL SECURITY;

-- บทบาทผู้ใช้
CREATE TABLE m1_identity.user_roles (
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('buyer', 'owner', 'agent', 'moderator', 'admin')),
  granted_at timestamptz NOT NULL DEFAULT now(),
  granted_by uuid,
  PRIMARY KEY (user_id, role)
);
COMMENT ON TABLE m1_identity.user_roles IS 'บทบาทผู้ใช้ — บทบาทของผู้ใช้ (1 คนมีได้หลายบทบาท) ใช้ตรวจสิทธิ์ RBAC';
COMMENT ON COLUMN m1_identity.user_roles.user_id IS 'ผู้ใช้';
COMMENT ON COLUMN m1_identity.user_roles.role IS 'บทบาท';
COMMENT ON COLUMN m1_identity.user_roles.granted_at IS 'เวลาได้รับ';
COMMENT ON COLUMN m1_identity.user_roles.granted_by IS 'ผู้มอบ (NULL = ระบบ)';
ALTER TABLE m1_identity.user_roles ENABLE ROW LEVEL SECURITY;

-- บัญชีล็อกอิน
CREATE TABLE m1_identity.auth_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider text NOT NULL CHECK (provider IN ('line', 'google')),
  provider_account_id text NOT NULL,
  email citext,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m1_identity.auth_accounts IS 'บัญชีล็อกอิน — บัญชี LINE / Google ที่ผูกกับผู้ใช้ · ไม่เก็บ access token';
COMMENT ON COLUMN m1_identity.auth_accounts.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m1_identity.auth_accounts.user_id IS 'ผู้ใช้';
COMMENT ON COLUMN m1_identity.auth_accounts.provider IS 'ผู้ให้บริการ';
COMMENT ON COLUMN m1_identity.auth_accounts.provider_account_id IS 'รหัสผู้ใช้ฝั่งผู้ให้บริการ';
COMMENT ON COLUMN m1_identity.auth_accounts.email IS 'อีเมลที่ได้จากผู้ให้บริการ';
COMMENT ON COLUMN m1_identity.auth_accounts.last_login_at IS 'ล็อกอินล่าสุด';
COMMENT ON COLUMN m1_identity.auth_accounts.created_at IS 'เวลาสร้าง';
CREATE UNIQUE INDEX auth_accounts_provider_uq ON m1_identity.auth_accounts (provider, provider_account_id);
CREATE INDEX auth_accounts_user_idx ON m1_identity.auth_accounts (user_id);
ALTER TABLE m1_identity.auth_accounts ENABLE ROW LEVEL SECURITY;

-- เซสชัน
CREATE TABLE m1_identity.sessions (
  session_token text PRIMARY KEY,
  user_id uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  ip inet,
  user_agent text,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m1_identity.sessions IS 'เซสชัน — เซสชันล็อกอินแบบเก็บในฐานข้อมูล (Auth.js) ยกเลิกได้ทันทีเมื่อแบน/ออกจากระบบทุกเครื่อง';
COMMENT ON COLUMN m1_identity.sessions.session_token IS 'ค่า hash SHA-256 ของโทเคนในคุกกี้';
COMMENT ON COLUMN m1_identity.sessions.user_id IS 'ผู้ใช้';
COMMENT ON COLUMN m1_identity.sessions.expires_at IS 'หมดอายุ';
COMMENT ON COLUMN m1_identity.sessions.ip IS 'IP ตอนล็อกอิน';
COMMENT ON COLUMN m1_identity.sessions.user_agent IS 'อุปกรณ์';
COMMENT ON COLUMN m1_identity.sessions.revoked_at IS 'เวลาถูกยกเลิก';
COMMENT ON COLUMN m1_identity.sessions.created_at IS 'เวลาสร้าง';
CREATE INDEX sessions_user_idx ON m1_identity.sessions (user_id);
CREATE INDEX sessions_expires_idx ON m1_identity.sessions (expires_at);
ALTER TABLE m1_identity.sessions ENABLE ROW LEVEL SECURITY;

-- โปรไฟล์นายหน้า
CREATE TABLE m1_identity.agent_profiles (
  user_id uuid PRIMARY KEY,
  kyc_status text NOT NULL DEFAULT 'none' CHECK (kyc_status IN ('none', 'pending', 'verified', 'rejected')),
  verified_at timestamptz,
  license_no text,
  company_name text,
  bio text,
  microsite_slug citext UNIQUE CHECK (microsite_slug ~ '^[a-z0-9-]{3,40}$'),
  service_district_codes text[] NOT NULL DEFAULT '{}',
  line_id text,
  rating_avg numeric(3,2) NOT NULL DEFAULT 0,
  rating_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m1_identity.agent_profiles IS 'โปรไฟล์นายหน้า — ข้อมูลเพิ่มของนายหน้า (1:1 กับ users) · ไมโครไซต์ · พื้นที่ให้บริการ · คะแนนรีวิว';
COMMENT ON COLUMN m1_identity.agent_profiles.user_id IS 'ผู้ใช้ (1:1)';
COMMENT ON COLUMN m1_identity.agent_profiles.kyc_status IS 'สถานะยืนยันตัวตน';
COMMENT ON COLUMN m1_identity.agent_profiles.verified_at IS 'เวลาผ่าน KYC';
COMMENT ON COLUMN m1_identity.agent_profiles.license_no IS 'เลขใบอนุญาตนายหน้า (ถ้ามี)';
COMMENT ON COLUMN m1_identity.agent_profiles.company_name IS 'บริษัท';
COMMENT ON COLUMN m1_identity.agent_profiles.bio IS 'แนะนำตัว';
COMMENT ON COLUMN m1_identity.agent_profiles.microsite_slug IS 'ชื่อลิงก์ไมโครไซต์';
COMMENT ON COLUMN m1_identity.agent_profiles.service_district_codes IS 'อำเภอที่ให้บริการ';
COMMENT ON COLUMN m1_identity.agent_profiles.line_id IS 'LINE ID สาธารณะ';
COMMENT ON COLUMN m1_identity.agent_profiles.rating_avg IS 'คะแนนเฉลี่ย';
COMMENT ON COLUMN m1_identity.agent_profiles.rating_count IS 'จำนวนรีวิว';
COMMENT ON COLUMN m1_identity.agent_profiles.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m1_identity.agent_profiles.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE INDEX agent_profiles_districts_gin ON m1_identity.agent_profiles USING gin (service_district_codes);
CREATE TRIGGER agent_profiles_set_updated_at BEFORE UPDATE ON m1_identity.agent_profiles FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m1_identity.agent_profiles ENABLE ROW LEVEL SECURITY;

-- คำขอยืนยันตัวตน
CREATE TABLE m1_identity.kyc_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  id_card_key text NOT NULL,
  selfie_key text NOT NULL,
  license_key text,
  id_card_last4 text CHECK (id_card_last4 ~ '^[0-9]{4}$'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  sla_due_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  files_purged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m1_identity.kyc_submissions IS 'คำขอยืนยันตัวตน — เอกสาร KYC เก็บใน R2 ส่วนตัว (ลิงก์ชั่วคราว 5 นาที) · SLA ตรวจ 24 ชม. · เก็บเลขบัตรแค่ 4 ตัวท้าย';
COMMENT ON COLUMN m1_identity.kyc_submissions.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m1_identity.kyc_submissions.user_id IS 'ผู้ยื่น';
COMMENT ON COLUMN m1_identity.kyc_submissions.id_card_key IS 'ไฟล์บัตรประชาชน (R2 ส่วนตัว)';
COMMENT ON COLUMN m1_identity.kyc_submissions.selfie_key IS 'ไฟล์เซลฟีคู่บัตร (R2 ส่วนตัว)';
COMMENT ON COLUMN m1_identity.kyc_submissions.license_key IS 'ไฟล์ใบอนุญาต (ถ้ามี)';
COMMENT ON COLUMN m1_identity.kyc_submissions.id_card_last4 IS 'เลขบัตร 4 ตัวท้าย';
COMMENT ON COLUMN m1_identity.kyc_submissions.status IS 'ผลตรวจ';
COMMENT ON COLUMN m1_identity.kyc_submissions.reject_reason IS 'เหตุผลที่ไม่ผ่าน';
COMMENT ON COLUMN m1_identity.kyc_submissions.reviewed_by IS 'แอดมินผู้ตรวจ';
COMMENT ON COLUMN m1_identity.kyc_submissions.reviewed_at IS 'เวลาตรวจ';
COMMENT ON COLUMN m1_identity.kyc_submissions.sla_due_at IS 'ต้องตรวจเสร็จภายใน (งาน kyc.sla)';
COMMENT ON COLUMN m1_identity.kyc_submissions.files_purged_at IS 'เวลาลบไฟล์ภาพตามนโยบายเก็บข้อมูล';
COMMENT ON COLUMN m1_identity.kyc_submissions.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m1_identity.kyc_submissions.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE UNIQUE INDEX kyc_submissions_one_pending_uq ON m1_identity.kyc_submissions (user_id) WHERE status = 'pending';
CREATE INDEX kyc_submissions_queue_idx ON m1_identity.kyc_submissions (sla_due_at) WHERE status = 'pending';
CREATE TRIGGER kyc_submissions_set_updated_at BEFORE UPDATE ON m1_identity.kyc_submissions FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m1_identity.kyc_submissions ENABLE ROW LEVEL SECURITY;

-- ความยินยอม (PDPA)
CREATE TABLE m1_identity.consents (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('terms', 'privacy', 'marketing', 'contact_share', 'location')),
  granted boolean NOT NULL,
  version text NOT NULL,
  ip inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m1_identity.consents IS 'ความยินยอม (PDPA) — บันทึกความยินยอมแบบเพิ่มอย่างเดียว ถอนความยินยอม = เพิ่มแถวใหม่ granted = false';
COMMENT ON COLUMN m1_identity.consents.id IS 'รหัสเลขรัน (bigint)';
COMMENT ON COLUMN m1_identity.consents.user_id IS 'ผู้ให้ความยินยอม';
COMMENT ON COLUMN m1_identity.consents.purpose IS 'วัตถุประสงค์';
COMMENT ON COLUMN m1_identity.consents.granted IS 'ยินยอม / ถอน';
COMMENT ON COLUMN m1_identity.consents.version IS 'เวอร์ชันข้อความที่ผู้ใช้เห็น';
COMMENT ON COLUMN m1_identity.consents.ip IS 'IP';
COMMENT ON COLUMN m1_identity.consents.user_agent IS 'อุปกรณ์';
COMMENT ON COLUMN m1_identity.consents.created_at IS 'เวลาสร้าง';
CREATE INDEX consents_user_purpose_idx ON m1_identity.consents (user_id, purpose, created_at DESC);
ALTER TABLE m1_identity.consents ENABLE ROW LEVEL SECURITY;

-- อุปกรณ์รับแจ้งเตือน
CREATE TABLE m1_identity.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  failed_count int NOT NULL DEFAULT 0,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m1_identity.push_subscriptions IS 'อุปกรณ์รับแจ้งเตือน — Web Push subscription ต่ออุปกรณ์ (VAPID) · ส่งพลาดหลายครั้งลบทิ้ง';
COMMENT ON COLUMN m1_identity.push_subscriptions.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m1_identity.push_subscriptions.user_id IS 'ผู้ใช้';
COMMENT ON COLUMN m1_identity.push_subscriptions.endpoint IS 'URL ปลายทางของเบราว์เซอร์';
COMMENT ON COLUMN m1_identity.push_subscriptions.p256dh IS 'กุญแจเข้ารหัส';
COMMENT ON COLUMN m1_identity.push_subscriptions.auth IS 'auth secret';
COMMENT ON COLUMN m1_identity.push_subscriptions.user_agent IS 'อุปกรณ์';
COMMENT ON COLUMN m1_identity.push_subscriptions.failed_count IS 'ส่งพลาดติดกัน';
COMMENT ON COLUMN m1_identity.push_subscriptions.last_used_at IS 'ส่งสำเร็จล่าสุด';
COMMENT ON COLUMN m1_identity.push_subscriptions.created_at IS 'เวลาสร้าง';
CREATE INDEX push_subscriptions_user_idx ON m1_identity.push_subscriptions (user_id);
ALTER TABLE m1_identity.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- ทีมนายหน้า
CREATE TABLE m1_identity.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_user_id uuid NOT NULL,
  seat_limit int NOT NULL DEFAULT 3 CHECK (seat_limit BETWEEN 1 AND 50),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m1_identity.teams IS 'ทีมนายหน้า — ทีม/บริษัทนายหน้า จำนวนที่นั่งตามแพ็กเกจ team_seats';
COMMENT ON COLUMN m1_identity.teams.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m1_identity.teams.name IS 'ชื่อทีม';
COMMENT ON COLUMN m1_identity.teams.owner_user_id IS 'หัวหน้าทีม';
COMMENT ON COLUMN m1_identity.teams.seat_limit IS 'จำนวนที่นั่งสูงสุด';
COMMENT ON COLUMN m1_identity.teams.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m1_identity.teams.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE TRIGGER teams_set_updated_at BEFORE UPDATE ON m1_identity.teams FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m1_identity.teams ENABLE ROW LEVEL SECURITY;

-- สมาชิกทีม
CREATE TABLE m1_identity.team_members (
  team_id uuid NOT NULL,
  user_id uuid NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);
COMMENT ON TABLE m1_identity.team_members IS 'สมาชิกทีม — นายหน้า 1 คนอยู่ได้ 1 ทีม';
COMMENT ON COLUMN m1_identity.team_members.team_id IS 'ทีม';
COMMENT ON COLUMN m1_identity.team_members.user_id IS 'สมาชิก (1 คน 1 ทีม)';
COMMENT ON COLUMN m1_identity.team_members.role IS 'บทบาทในทีม';
COMMENT ON COLUMN m1_identity.team_members.joined_at IS 'เวลาเข้าทีม';
ALTER TABLE m1_identity.team_members ENABLE ROW LEVEL SECURITY;

-- ประเภททรัพย์
CREATE TABLE m2_listing.property_types (
  code text PRIMARY KEY,
  name_th text NOT NULL,
  name_en text,
  required_fields jsonb NOT NULL DEFAULT '[]',
  sort_order int NOT NULL DEFAULT 0,
  deprecated_at timestamptz
);
COMMENT ON TABLE m2_listing.property_types IS 'ประเภททรัพย์ — ตารางอ้างอิง: คอนโด บ้านเดี่ยว ทาวน์โฮม ที่ดิน อาคารพาณิชย์ ฯลฯ · เลิกใช้ด้วย deprecated_at ไม่ลบ';
COMMENT ON COLUMN m2_listing.property_types.code IS 'รหัส เช่น condo · house · land';
COMMENT ON COLUMN m2_listing.property_types.name_th IS 'ชื่อไทย';
COMMENT ON COLUMN m2_listing.property_types.name_en IS 'ชื่ออังกฤษ';
COMMENT ON COLUMN m2_listing.property_types.required_fields IS 'ช่องที่ต้องกรอกของประเภทนี้ เช่น ที่ดินต้องมี land_area_sqw';
COMMENT ON COLUMN m2_listing.property_types.sort_order IS 'ลำดับแสดง';
COMMENT ON COLUMN m2_listing.property_types.deprecated_at IS 'เลิกใช้';
ALTER TABLE m2_listing.property_types ENABLE ROW LEVEL SECURITY;

-- สิ่งอำนวยความสะดวก
CREATE TABLE m2_listing.amenities (
  code text PRIMARY KEY,
  name_th text NOT NULL,
  name_en text,
  category text NOT NULL CHECK (category IN ('facility', 'security', 'nearby', 'interior')),
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  deprecated_at timestamptz
);
COMMENT ON TABLE m2_listing.amenities IS 'สิ่งอำนวยความสะดวก — ตารางอ้างอิง: สระว่ายน้ำ ฟิตเนส รปภ. 24 ชม. ใกล้มหาวิทยาลัย ฯลฯ';
COMMENT ON COLUMN m2_listing.amenities.code IS 'รหัส เช่น pool · gym';
COMMENT ON COLUMN m2_listing.amenities.name_th IS 'ชื่อไทย';
COMMENT ON COLUMN m2_listing.amenities.name_en IS 'ชื่ออังกฤษ เช่น Swimming Pool, Fitness';
COMMENT ON COLUMN m2_listing.amenities.category IS 'หมวด';
COMMENT ON COLUMN m2_listing.amenities.icon IS 'ไอคอน';
COMMENT ON COLUMN m2_listing.amenities.sort_order IS 'ลำดับแสดง';
COMMENT ON COLUMN m2_listing.amenities.deprecated_at IS 'เลิกใช้';
ALTER TABLE m2_listing.amenities ENABLE ROW LEVEL SECURITY;

-- โครงการ
CREATE TABLE m2_listing.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_th text NOT NULL,
  name_en text,
  aliases text[] NOT NULL DEFAULT '{}',
  developer text,
  property_type_code text,
  location geography(Point,4326),
  subdistrict_code text,
  year_built smallint,
  total_units int,
  verified boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m2_listing.projects IS 'โครงการ — คอนโด/หมู่บ้าน ให้เลือกตอนลงประกาศ (พิมพ์ชื่อเล่นก็เจอ) · ผู้ใช้เสนอโครงการใหม่ได้ แอดมินยืนยัน';
COMMENT ON COLUMN m2_listing.projects.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m2_listing.projects.name_th IS 'ชื่อโครงการ';
COMMENT ON COLUMN m2_listing.projects.name_en IS 'ชื่ออังกฤษ';
COMMENT ON COLUMN m2_listing.projects.aliases IS 'ชื่อเรียกอื่น';
COMMENT ON COLUMN m2_listing.projects.developer IS 'ผู้พัฒนา';
COMMENT ON COLUMN m2_listing.projects.property_type_code IS 'ประเภทหลักของโครงการ';
COMMENT ON COLUMN m2_listing.projects.location IS 'พิกัดโครงการ';
COMMENT ON COLUMN m2_listing.projects.subdistrict_code IS 'ตำบล';
COMMENT ON COLUMN m2_listing.projects.year_built IS 'ปีที่สร้างเสร็จ';
COMMENT ON COLUMN m2_listing.projects.total_units IS 'จำนวนยูนิตทั้งหมด';
COMMENT ON COLUMN m2_listing.projects.verified IS 'แอดมินยืนยันแล้ว';
COMMENT ON COLUMN m2_listing.projects.created_by IS 'ผู้เสนอ';
COMMENT ON COLUMN m2_listing.projects.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m2_listing.projects.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE INDEX projects_name_trgm ON m2_listing.projects USING gin (name_th gin_trgm_ops);
CREATE INDEX projects_location_gix ON m2_listing.projects USING gist (location);
CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON m2_listing.projects FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m2_listing.projects ENABLE ROW LEVEL SECURITY;

-- ยูนิต/แปลงจริง
CREATE TABLE m2_listing.listing_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_key text NOT NULL UNIQUE,
  project_id uuid,
  building text,
  floor_label text,
  unit_no text,
  deed_no_hash text,
  location geography(Point,4326),
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m2_listing.listing_units IS 'ยูนิต/แปลงจริง — ตัวตนของทรัพย์จริง 1 ห้อง/1 แปลง ใช้ตรวจประกาศซ้ำจากหลายคน';
COMMENT ON COLUMN m2_listing.listing_units.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m2_listing.listing_units.unit_key IS 'คีย์มาตรฐาน: โครงการ+ตึก+ชั้น+ห้อง หรือ hash เลขโฉนด';
COMMENT ON COLUMN m2_listing.listing_units.project_id IS 'โครงการ';
COMMENT ON COLUMN m2_listing.listing_units.building IS 'อาคาร';
COMMENT ON COLUMN m2_listing.listing_units.floor_label IS 'ชั้น';
COMMENT ON COLUMN m2_listing.listing_units.unit_no IS 'เลขห้อง/บ้านเลขที่';
COMMENT ON COLUMN m2_listing.listing_units.deed_no_hash IS 'hash เลขโฉนด (ไม่เก็บเลขจริง)';
COMMENT ON COLUMN m2_listing.listing_units.location IS 'พิกัด';
COMMENT ON COLUMN m2_listing.listing_units.created_at IS 'เวลาสร้าง';
CREATE INDEX listing_units_project_idx ON m2_listing.listing_units (project_id);
ALTER TABLE m2_listing.listing_units ENABLE ROW LEVEL SECURITY;

-- ประกาศ
CREATE TABLE m2_listing.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code text NOT NULL UNIQUE,
  poster_user_id uuid NOT NULL,
  poster_role text NOT NULL CHECK (poster_role IN ('owner', 'agent')),
  team_id uuid,
  deal_type text NOT NULL CHECK (deal_type IN ('sale', 'rent')),
  property_type_code text NOT NULL,
  project_id uuid,
  unit_id uuid,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'reserved', 'sold', 'archived')),
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'hidden')),
  hidden_reason text,
  title text,
  title_en text,
  description text,
  description_en text,
  price_thb bigint CHECK (price_thb > 0),
  price_negotiable boolean NOT NULL DEFAULT false,
  bedrooms smallint CHECK (bedrooms >= 0),
  bathrooms smallint CHECK (bathrooms >= 0),
  usable_area_sqm numeric(10,2) CHECK (usable_area_sqm > 0),
  land_area_sqw numeric(10,2) CHECK (land_area_sqw > 0),
  attributes jsonb NOT NULL DEFAULT '{}',
  location geography(Point,4326),
  display_location geography(Point,4326),
  location_precision text NOT NULL DEFAULT 'approximate' CHECK (location_precision IN ('exact', 'approximate', 'area_only')),
  address_text text,
  province_code text,
  district_code text,
  subdistrict_code text,
  sale_channel text NOT NULL DEFAULT 'direct' CHECK (sale_channel IN ('direct', 'agent_hub')),
  hub_mode text CHECK (hub_mode IN ('open', 'exclusive')),
  commission_pct numeric(4,2) CHECK (commission_pct BETWEEN 0 AND 10),
  spotlight_until timestamptz,
  trust_score smallint NOT NULL DEFAULT 0 CHECK (trust_score BETWEEN 0 AND 100),
  reserved_until timestamptz,
  published_at timestamptz,
  last_confirmed_at timestamptz,
  expires_at timestamptz,
  sold_at timestamptz,
  view_count int NOT NULL DEFAULT 0,
  favorite_count int NOT NULL DEFAULT 0,
  chat_count int NOT NULL DEFAULT 0,
  factsheet_key text,
  factsheet_hash text,
  version int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT listings_reserved_needs_until_chk CHECK (status <> 'reserved' OR reserved_until IS NOT NULL),
  CONSTRAINT listings_published_complete_chk CHECK (status = 'draft' OR (title IS NOT NULL AND price_thb IS NOT NULL AND location IS NOT NULL AND display_location IS NOT NULL)),
  CONSTRAINT listings_hub_mode_matches_channel_chk CHECK ((sale_channel = 'agent_hub') = (hub_mode IS NOT NULL))
);
COMMENT ON TABLE m2_listing.listings IS 'ประกาศ — ตารางหลัก: 1 แถว = 1 ประกาศขาย/เช่า · พิกัดจริงเป็นข้อมูลส่วนตัว แสดงผลด้วย display_location · status sold = ขายแล้ว/ปล่อยเช่าแล้ว';
COMMENT ON COLUMN m2_listing.listings.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m2_listing.listings.public_code IS 'รหัสประกาศที่แสดง เช่น UD-000123';
COMMENT ON COLUMN m2_listing.listings.poster_user_id IS 'ผู้ลงประกาศ';
COMMENT ON COLUMN m2_listing.listings.poster_role IS 'ลงในฐานะ';
COMMENT ON COLUMN m2_listing.listings.team_id IS 'ทีมนายหน้า (ถ้ามี)';
COMMENT ON COLUMN m2_listing.listings.deal_type IS 'ขาย / เช่า';
COMMENT ON COLUMN m2_listing.listings.property_type_code IS 'ประเภททรัพย์';
COMMENT ON COLUMN m2_listing.listings.project_id IS 'โครงการ';
COMMENT ON COLUMN m2_listing.listings.unit_id IS 'ยูนิตจริง (กันซ้ำ)';
COMMENT ON COLUMN m2_listing.listings.status IS 'สถานะประกาศ';
COMMENT ON COLUMN m2_listing.listings.review_status IS 'ผลตรวจของแอดมิน';
COMMENT ON COLUMN m2_listing.listings.hidden_reason IS 'เหตุผลที่ถูกซ่อน';
COMMENT ON COLUMN m2_listing.listings.title IS 'หัวข้อ (ไทย)';
COMMENT ON COLUMN m2_listing.listings.title_en IS 'หัวข้อภาษาอังกฤษ (ไม่บังคับ สำหรับจับลูกค้าต่างชาติ)';
COMMENT ON COLUMN m2_listing.listings.description IS 'รายละเอียด (ไทย)';
COMMENT ON COLUMN m2_listing.listings.description_en IS 'รายละเอียดภาษาอังกฤษ (ไม่บังคับ สำหรับจับลูกค้าต่างชาติ)';
COMMENT ON COLUMN m2_listing.listings.price_thb IS 'ราคา (บาท) · เช่า = ต่อเดือน';
COMMENT ON COLUMN m2_listing.listings.price_negotiable IS 'ต่อรองได้';
COMMENT ON COLUMN m2_listing.listings.bedrooms IS 'ห้องนอน';
COMMENT ON COLUMN m2_listing.listings.bathrooms IS 'ห้องน้ำ';
COMMENT ON COLUMN m2_listing.listings.usable_area_sqm IS 'พื้นที่ใช้สอย (ตร.ม.)';
COMMENT ON COLUMN m2_listing.listings.land_area_sqw IS 'ที่ดิน (ตร.ว.)';
COMMENT ON COLUMN m2_listing.listings.attributes IS 'ข้อมูลเฉพาะประเภท เช่น ชั้น ทิศ เฟอร์นิเจอร์';
COMMENT ON COLUMN m2_listing.listings.location IS 'พิกัดจริง 🔒 ส่วนตัว ใช้จับคู่เท่านั้น';
COMMENT ON COLUMN m2_listing.listings.display_location IS 'พิกัดที่แสดงบนแผนที่ (เลื่อนตามความแม่นยำ)';
COMMENT ON COLUMN m2_listing.listings.location_precision IS 'ความแม่นยำที่เจ้าของเลือก';
COMMENT ON COLUMN m2_listing.listings.address_text IS 'ที่อยู่ 🔒 ส่วนตัว';
COMMENT ON COLUMN m2_listing.listings.province_code IS 'จังหวัด';
COMMENT ON COLUMN m2_listing.listings.district_code IS 'อำเภอ';
COMMENT ON COLUMN m2_listing.listings.subdistrict_code IS 'ตำบล';
COMMENT ON COLUMN m2_listing.listings.sale_channel IS 'ขายเอง / ฝาก Agent Hub';
COMMENT ON COLUMN m2_listing.listings.hub_mode IS 'Hub แบบเปิด / Exclusive';
COMMENT ON COLUMN m2_listing.listings.commission_pct IS 'ค่าคอมมิชชันที่เสนอ (%)';
COMMENT ON COLUMN m2_listing.listings.spotlight_until IS 'Spotlight ถึงเมื่อไร';
COMMENT ON COLUMN m2_listing.listings.trust_score IS 'คะแนนความน่าเชื่อถือ';
COMMENT ON COLUMN m2_listing.listings.reserved_until IS 'ครบกำหนดจอง (งาน reservation.due)';
COMMENT ON COLUMN m2_listing.listings.published_at IS 'เผยแพร่ครั้งแรก';
COMMENT ON COLUMN m2_listing.listings.last_confirmed_at IS 'เจ้าของยืนยันว่ายังว่างล่าสุด';
COMMENT ON COLUMN m2_listing.listings.expires_at IS 'ครบ 30 วันไม่ยืนยัน ➜ archived';
COMMENT ON COLUMN m2_listing.listings.sold_at IS 'เวลาขาย/ปล่อยเช่าได้';
COMMENT ON COLUMN m2_listing.listings.view_count IS 'ยอดดูสะสม';
COMMENT ON COLUMN m2_listing.listings.favorite_count IS 'ยอดบันทึก';
COMMENT ON COLUMN m2_listing.listings.chat_count IS 'ยอดแชท';
COMMENT ON COLUMN m2_listing.listings.factsheet_key IS 'ไฟล์ PDF ล่าสุดใน R2';
COMMENT ON COLUMN m2_listing.listings.factsheet_hash IS 'hash ข้อมูลตอนสร้าง PDF (เปลี่ยน ➜ สร้างใหม่)';
COMMENT ON COLUMN m2_listing.listings.version IS 'เลขเวอร์ชันกันแก้ทับกัน (optimistic lock)';
COMMENT ON COLUMN m2_listing.listings.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m2_listing.listings.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
COMMENT ON COLUMN m2_listing.listings.deleted_at IS 'ลบแบบ soft delete (NULL = ยังใช้งาน)';
CREATE INDEX listings_poster_idx ON m2_listing.listings (poster_user_id, status);
CREATE UNIQUE INDEX listings_unit_poster_uq ON m2_listing.listings (unit_id, poster_user_id) WHERE status IN ('draft', 'active', 'reserved');
CREATE INDEX listings_location_gix ON m2_listing.listings USING gist (location) WHERE status = 'active';
CREATE INDEX listings_freshness_idx ON m2_listing.listings (expires_at) WHERE status = 'active';
CREATE INDEX listings_reserved_idx ON m2_listing.listings (reserved_until) WHERE status = 'reserved';
CREATE INDEX listings_review_queue_idx ON m2_listing.listings (created_at) WHERE review_status = 'pending' AND status <> 'draft';
CREATE INDEX listings_project_idx ON m2_listing.listings (project_id);
CREATE TRIGGER listings_set_updated_at BEFORE UPDATE ON m2_listing.listings FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m2_listing.listings ENABLE ROW LEVEL SECURITY;

-- สิ่งอำนวยฯ ของประกาศ
CREATE TABLE m2_listing.listing_amenities (
  listing_id uuid NOT NULL,
  amenity_code text NOT NULL,
  PRIMARY KEY (listing_id, amenity_code)
);
COMMENT ON TABLE m2_listing.listing_amenities IS 'สิ่งอำนวยฯ ของประกาศ — ประกาศ ↔ สิ่งอำนวยความสะดวก (หลายต่อหลาย)';
COMMENT ON COLUMN m2_listing.listing_amenities.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m2_listing.listing_amenities.amenity_code IS 'สิ่งอำนวยความสะดวก';
ALTER TABLE m2_listing.listing_amenities ENABLE ROW LEVEL SECURITY;

-- รูปประกาศ
CREATE TABLE m2_listing.listing_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  original_key text NOT NULL,
  public_key text,
  width int,
  height int,
  bytes int,
  phash text,
  sort_order smallint NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'ready', 'failed', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m2_listing.listing_photos IS 'รูปประกาศ — รูปที่ผ่าน image.process แล้ว (ลบ EXIF · WebP · ลายน้ำ) · รูปปกได้ 1 รูป';
COMMENT ON COLUMN m2_listing.listing_photos.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m2_listing.listing_photos.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m2_listing.listing_photos.original_key IS 'ไฟล์ต้นฉบับ (R2 ส่วนตัว ลบหลังประมวลผล)';
COMMENT ON COLUMN m2_listing.listing_photos.public_key IS 'ไฟล์ WebP สาธารณะ';
COMMENT ON COLUMN m2_listing.listing_photos.width IS 'กว้าง (px)';
COMMENT ON COLUMN m2_listing.listing_photos.height IS 'สูง (px)';
COMMENT ON COLUMN m2_listing.listing_photos.bytes IS 'ขนาดไฟล์';
COMMENT ON COLUMN m2_listing.listing_photos.phash IS 'ลายนิ้วมือภาพ ใช้ตรวจรูปซ้ำ/รูปขโมย';
COMMENT ON COLUMN m2_listing.listing_photos.sort_order IS 'ลำดับ';
COMMENT ON COLUMN m2_listing.listing_photos.is_cover IS 'รูปปก';
COMMENT ON COLUMN m2_listing.listing_photos.status IS 'สถานะไฟล์';
COMMENT ON COLUMN m2_listing.listing_photos.created_at IS 'เวลาสร้าง';
CREATE UNIQUE INDEX listing_photos_one_cover_uq ON m2_listing.listing_photos (listing_id) WHERE is_cover;
CREATE INDEX listing_photos_listing_idx ON m2_listing.listing_photos (listing_id, sort_order);
ALTER TABLE m2_listing.listing_photos ENABLE ROW LEVEL SECURITY;

-- ประวัติสถานะประกาศ
CREATE TABLE m2_listing.listing_status_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  listing_id uuid NOT NULL,
  from_status text,
  to_status text NOT NULL,
  reason text,
  changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m2_listing.listing_status_history IS 'ประวัติสถานะประกาศ — ทุกครั้งที่สถานะเปลี่ยน (คู่กับ EV-04) ใช้ตรวจย้อนหลังและคำนวณ trust_score';
COMMENT ON COLUMN m2_listing.listing_status_history.id IS 'รหัสเลขรัน (bigint)';
COMMENT ON COLUMN m2_listing.listing_status_history.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m2_listing.listing_status_history.from_status IS 'จากสถานะ';
COMMENT ON COLUMN m2_listing.listing_status_history.to_status IS 'เป็นสถานะ';
COMMENT ON COLUMN m2_listing.listing_status_history.reason IS 'เหตุผล เช่น expired · admin_hide · reservation_lapsed';
COMMENT ON COLUMN m2_listing.listing_status_history.changed_by IS 'ผู้เปลี่ยน (NULL = ระบบ)';
COMMENT ON COLUMN m2_listing.listing_status_history.created_at IS 'เวลาสร้าง';
CREATE INDEX listing_status_history_listing_idx ON m2_listing.listing_status_history (listing_id, created_at DESC);
ALTER TABLE m2_listing.listing_status_history ENABLE ROW LEVEL SECURITY;

-- เอกสารประกาศ
CREATE TABLE m2_listing.listing_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  doc_type text NOT NULL CHECK (doc_type IN ('title_deed', 'owner_id_card', 'power_of_attorney', 'other')),
  file_key text NOT NULL,
  verify_status text NOT NULL DEFAULT 'pending' CHECK (verify_status IN ('pending', 'verified', 'rejected')),
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m2_listing.listing_documents IS 'เอกสารประกาศ — โฉนด / หนังสือมอบอำนาจ เก็บ R2 ส่วนตัว ใช้ยืนยันกรรมสิทธิ์ (เพิ่ม trust_score)';
COMMENT ON COLUMN m2_listing.listing_documents.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m2_listing.listing_documents.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m2_listing.listing_documents.doc_type IS 'ชนิดเอกสาร';
COMMENT ON COLUMN m2_listing.listing_documents.file_key IS 'ไฟล์ (R2 ส่วนตัว)';
COMMENT ON COLUMN m2_listing.listing_documents.verify_status IS 'ผลตรวจ';
COMMENT ON COLUMN m2_listing.listing_documents.verified_by IS 'แอดมินผู้ตรวจ';
COMMENT ON COLUMN m2_listing.listing_documents.verified_at IS 'เวลาตรวจ';
COMMENT ON COLUMN m2_listing.listing_documents.created_at IS 'เวลาสร้าง';
CREATE INDEX listing_documents_listing_idx ON m2_listing.listing_documents (listing_id);
ALTER TABLE m2_listing.listing_documents ENABLE ROW LEVEL SECURITY;

-- สถิติรายวัน
CREATE TABLE m2_listing.listing_daily_stats (
  listing_id uuid NOT NULL,
  day date NOT NULL,
  views int NOT NULL DEFAULT 0,
  favorites int NOT NULL DEFAULT 0,
  chats int NOT NULL DEFAULT 0,
  phone_reveals int NOT NULL DEFAULT 0,
  shares int NOT NULL DEFAULT 0,
  PRIMARY KEY (listing_id, day)
);
COMMENT ON TABLE m2_listing.listing_daily_stats IS 'สถิติรายวัน — ยอดรายวันต่อประกาศ (หน้า S39) · งาน stats.flush ย้ายจาก Redis ทุกชั่วโมง';
COMMENT ON COLUMN m2_listing.listing_daily_stats.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m2_listing.listing_daily_stats.day IS 'วันที่';
COMMENT ON COLUMN m2_listing.listing_daily_stats.views IS 'ยอดดู';
COMMENT ON COLUMN m2_listing.listing_daily_stats.favorites IS 'ยอดบันทึก';
COMMENT ON COLUMN m2_listing.listing_daily_stats.chats IS 'ยอดเริ่มแชท';
COMMENT ON COLUMN m2_listing.listing_daily_stats.phone_reveals IS 'ยอดกดดูเบอร์';
COMMENT ON COLUMN m2_listing.listing_daily_stats.shares IS 'ยอดแชร์';
ALTER TABLE m2_listing.listing_daily_stats ENABLE ROW LEVEL SECURITY;

-- การดัน/Spotlight
CREATE TABLE m2_listing.listing_boosts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('boost', 'spotlight')),
  entitlement_id uuid,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT listing_boosts_period_valid_chk CHECK (ends_at > starts_at)
);
COMMENT ON TABLE m2_listing.listing_boosts IS 'การดัน/Spotlight — ประวัติการใช้สิทธิ์ดันประกาศ · ช่วงที่มีผลจะถูกคัดลอกไปที่ listing_index';
COMMENT ON COLUMN m2_listing.listing_boosts.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m2_listing.listing_boosts.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m2_listing.listing_boosts.kind IS 'ชนิด';
COMMENT ON COLUMN m2_listing.listing_boosts.entitlement_id IS 'สิทธิ์ที่ใช้';
COMMENT ON COLUMN m2_listing.listing_boosts.starts_at IS 'เริ่ม';
COMMENT ON COLUMN m2_listing.listing_boosts.ends_at IS 'สิ้นสุด';
COMMENT ON COLUMN m2_listing.listing_boosts.created_at IS 'เวลาสร้าง';
CREATE INDEX listing_boosts_listing_idx ON m2_listing.listing_boosts (listing_id, ends_at DESC);
ALTER TABLE m2_listing.listing_boosts ENABLE ROW LEVEL SECURITY;

-- ตารางค้นหา
CREATE TABLE m3_discovery.listing_index (
  listing_id uuid PRIMARY KEY,
  public_code text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'reserved')),
  deal_type text NOT NULL,
  property_type_code text NOT NULL,
  price_thb bigint NOT NULL,
  bedrooms smallint,
  bathrooms smallint,
  usable_area_sqm numeric(10,2),
  land_area_sqw numeric(10,2),
  display_location geography(Point,4326) NOT NULL,
  province_code text,
  district_code text,
  subdistrict_code text,
  project_id uuid,
  project_name text,
  title text NOT NULL,
  title_en text,
  cover_url text,
  amenity_codes text[] NOT NULL DEFAULT '{}',
  poster_role text NOT NULL,
  agent_verified boolean NOT NULL DEFAULT false,
  sale_channel text NOT NULL,
  trust_score smallint NOT NULL DEFAULT 0,
  rank_score real NOT NULL DEFAULT 0,
  boosted_until timestamptz,
  spotlight_until timestamptz,
  published_at timestamptz NOT NULL,
  indexed_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m3_discovery.listing_index IS 'ตารางค้นหา — Read model สำหรับหน้าค้นหาทั้งแบบแผนที่และรายการ · งาน search.index เขียนจาก EV-02/EV-04 · มีเฉพาะ active/reserved · ไม่มีพิกัดจริง';
COMMENT ON COLUMN m3_discovery.listing_index.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m3_discovery.listing_index.public_code IS 'รหัสประกาศ';
COMMENT ON COLUMN m3_discovery.listing_index.status IS 'active = ปกติ · reserved = การ์ด/หมุดสีเทา';
COMMENT ON COLUMN m3_discovery.listing_index.deal_type IS 'ขาย / เช่า';
COMMENT ON COLUMN m3_discovery.listing_index.property_type_code IS 'ประเภททรัพย์';
COMMENT ON COLUMN m3_discovery.listing_index.price_thb IS 'ราคา';
COMMENT ON COLUMN m3_discovery.listing_index.bedrooms IS 'ห้องนอน';
COMMENT ON COLUMN m3_discovery.listing_index.bathrooms IS 'ห้องน้ำ';
COMMENT ON COLUMN m3_discovery.listing_index.usable_area_sqm IS 'พื้นที่ใช้สอย';
COMMENT ON COLUMN m3_discovery.listing_index.land_area_sqw IS 'ที่ดิน';
COMMENT ON COLUMN m3_discovery.listing_index.display_location IS 'พิกัดที่แสดง (หมุด)';
COMMENT ON COLUMN m3_discovery.listing_index.province_code IS 'จังหวัด';
COMMENT ON COLUMN m3_discovery.listing_index.district_code IS 'อำเภอ';
COMMENT ON COLUMN m3_discovery.listing_index.subdistrict_code IS 'ตำบล';
COMMENT ON COLUMN m3_discovery.listing_index.project_id IS 'โครงการ';
COMMENT ON COLUMN m3_discovery.listing_index.project_name IS 'ชื่อโครงการ (สำเนา)';
COMMENT ON COLUMN m3_discovery.listing_index.title IS 'หัวข้อ (ไทย)';
COMMENT ON COLUMN m3_discovery.listing_index.title_en IS 'หัวข้อภาษาอังกฤษ (สำหรับแสดงผลเมื่อผู้ใช้เลือก EN)';
COMMENT ON COLUMN m3_discovery.listing_index.cover_url IS 'รูปปก (การ์ด)';
COMMENT ON COLUMN m3_discovery.listing_index.amenity_codes IS 'สิ่งอำนวยความสะดวก (กรอง)';
COMMENT ON COLUMN m3_discovery.listing_index.poster_role IS 'เจ้าของ / นายหน้า';
COMMENT ON COLUMN m3_discovery.listing_index.agent_verified IS 'ป้ายนายหน้ายืนยันแล้ว';
COMMENT ON COLUMN m3_discovery.listing_index.sale_channel IS 'ขายเอง / Agent Hub';
COMMENT ON COLUMN m3_discovery.listing_index.trust_score IS 'คะแนนความน่าเชื่อถือ';
COMMENT ON COLUMN m3_discovery.listing_index.rank_score IS 'คะแนนจัดอันดับ (ดัน · Spotlight · ความสด)';
COMMENT ON COLUMN m3_discovery.listing_index.boosted_until IS 'ดันถึง';
COMMENT ON COLUMN m3_discovery.listing_index.spotlight_until IS 'Spotlight ถึง';
COMMENT ON COLUMN m3_discovery.listing_index.published_at IS 'เผยแพร่';
COMMENT ON COLUMN m3_discovery.listing_index.indexed_at IS 'เวลาอัปเดตแถวนี้';
CREATE INDEX listing_index_geo_gix ON m3_discovery.listing_index USING gist (display_location);
CREATE INDEX listing_index_filter_idx ON m3_discovery.listing_index (deal_type, property_type_code, price_thb);
CREATE INDEX listing_index_rank_cursor_idx ON m3_discovery.listing_index (rank_score DESC, published_at DESC, listing_id);
CREATE INDEX listing_index_price_cursor_idx ON m3_discovery.listing_index (price_thb, listing_id);
CREATE INDEX listing_index_newest_cursor_idx ON m3_discovery.listing_index (published_at DESC, listing_id);
CREATE INDEX listing_index_area_idx ON m3_discovery.listing_index (district_code, subdistrict_code);
CREATE INDEX listing_index_amenity_gin ON m3_discovery.listing_index USING gin (amenity_codes);
CREATE INDEX listing_index_title_trgm ON m3_discovery.listing_index USING gin (title gin_trgm_ops);
ALTER TABLE m3_discovery.listing_index ENABLE ROW LEVEL SECURITY;

-- รายการโปรด
CREATE TABLE m3_discovery.favorites (
  user_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  price_at_save bigint NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);
COMMENT ON TABLE m3_discovery.favorites IS 'รายการโปรด — ทรัพย์ที่ผู้ใช้บันทึก · เก็บราคาตอนบันทึกเพื่อแจ้งเตือนเมื่อราคาลด';
COMMENT ON COLUMN m3_discovery.favorites.user_id IS 'ผู้ใช้';
COMMENT ON COLUMN m3_discovery.favorites.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m3_discovery.favorites.price_at_save IS 'ราคาตอนบันทึก';
COMMENT ON COLUMN m3_discovery.favorites.note IS 'โน้ตส่วนตัว';
COMMENT ON COLUMN m3_discovery.favorites.created_at IS 'เวลาสร้าง';
CREATE INDEX favorites_listing_idx ON m3_discovery.favorites (listing_id);
ALTER TABLE m3_discovery.favorites ENABLE ROW LEVEL SECURITY;

-- คิวรอทรัพย์
CREATE TABLE m3_discovery.waitlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'cancelled')),
  notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m3_discovery.waitlist_entries IS 'คิวรอทรัพย์ — ผู้ใช้กดรอคิวทรัพย์ที่ติดจอง ➜ หลุดจองแจ้งตามลำดับ (notify.waitlist)';
COMMENT ON COLUMN m3_discovery.waitlist_entries.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m3_discovery.waitlist_entries.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m3_discovery.waitlist_entries.user_id IS 'ผู้รอ';
COMMENT ON COLUMN m3_discovery.waitlist_entries.status IS 'สถานะ';
COMMENT ON COLUMN m3_discovery.waitlist_entries.notified_at IS 'เวลาแจ้ง';
COMMENT ON COLUMN m3_discovery.waitlist_entries.created_at IS 'เวลาสร้าง';
CREATE UNIQUE INDEX waitlist_entries_listing_user_uq ON m3_discovery.waitlist_entries (listing_id, user_id);
CREATE INDEX waitlist_entries_queue_idx ON m3_discovery.waitlist_entries (listing_id, created_at) WHERE status = 'waiting';
ALTER TABLE m3_discovery.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- คำขอสินเชื่อ
CREATE TABLE m3_discovery.mortgage_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  listing_id uuid,
  full_name text NOT NULL,
  phone_e164 text NOT NULL,
  monthly_income_thb int CHECK (monthly_income_thb >= 0),
  loan_amount_thb bigint CHECK (loan_amount_thb > 0),
  partner_bank text,
  consent_id bigint NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'sent', 'contacted', 'closed')),
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m3_discovery.mortgage_leads IS 'คำขอสินเชื่อ — ผู้สนใจกดขอประเมินสินเชื่อ ➜ ส่งต่อธนาคารพันธมิตร (ต้องมีความยินยอม)';
COMMENT ON COLUMN m3_discovery.mortgage_leads.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m3_discovery.mortgage_leads.user_id IS 'ผู้ขอ';
COMMENT ON COLUMN m3_discovery.mortgage_leads.listing_id IS 'ทรัพย์ที่สนใจ';
COMMENT ON COLUMN m3_discovery.mortgage_leads.full_name IS 'ชื่อ-สกุล';
COMMENT ON COLUMN m3_discovery.mortgage_leads.phone_e164 IS 'เบอร์ติดต่อ';
COMMENT ON COLUMN m3_discovery.mortgage_leads.monthly_income_thb IS 'รายได้ต่อเดือน';
COMMENT ON COLUMN m3_discovery.mortgage_leads.loan_amount_thb IS 'วงเงินที่ต้องการ';
COMMENT ON COLUMN m3_discovery.mortgage_leads.partner_bank IS 'ธนาคารที่ส่งต่อ';
COMMENT ON COLUMN m3_discovery.mortgage_leads.consent_id IS 'ความยินยอมส่งข้อมูล';
COMMENT ON COLUMN m3_discovery.mortgage_leads.status IS 'สถานะ';
COMMENT ON COLUMN m3_discovery.mortgage_leads.sent_at IS 'เวลาส่งต่อ';
COMMENT ON COLUMN m3_discovery.mortgage_leads.created_at IS 'เวลาสร้าง';
CREATE INDEX mortgage_leads_status_idx ON m3_discovery.mortgage_leads (status, created_at);
ALTER TABLE m3_discovery.mortgage_leads ENABLE ROW LEVEL SECURITY;

-- ความต้องการ (Finder)
CREATE TABLE m4_engage.criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  deal_type text NOT NULL CHECK (deal_type IN ('sale', 'rent')),
  property_type_codes text[] NOT NULL DEFAULT '{}',
  price_min_thb bigint CHECK (price_min_thb >= 0),
  price_max_thb bigint CHECK (price_max_thb > 0),
  bedrooms_min smallint,
  center geography(Point,4326) NOT NULL,
  display_center geography(Point,4326) NOT NULL,
  radius_m int NOT NULL CHECK (radius_m BETWEEN 500 AND 10000),
  landmark_id uuid,
  note text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'fulfilled', 'expired')),
  vip_until timestamptz,
  proposal_count int NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '30 days',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT criteria_price_range_valid_chk CHECK (price_min_thb IS NULL OR price_max_thb IS NULL OR price_min_thb <= price_max_thb)
);
COMMENT ON TABLE m4_engage.criteria IS 'ความต้องการ (Finder) — ผู้ซื้อ/ผู้เช่าโพสต์ความต้องการ + รัศมี · จุดศูนย์กลางจริงเป็นข้อมูลส่วนตัว · UI ให้เลือก 0.5–5 กม. (S17) ฐานข้อมูลรองรับถึง 10 กม.';
COMMENT ON COLUMN m4_engage.criteria.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m4_engage.criteria.user_id IS 'ผู้โพสต์';
COMMENT ON COLUMN m4_engage.criteria.deal_type IS 'ซื้อ / เช่า';
COMMENT ON COLUMN m4_engage.criteria.property_type_codes IS 'ประเภทที่สนใจ (ว่าง = ทุกประเภท)';
COMMENT ON COLUMN m4_engage.criteria.price_min_thb IS 'งบต่ำสุด';
COMMENT ON COLUMN m4_engage.criteria.price_max_thb IS 'งบสูงสุด';
COMMENT ON COLUMN m4_engage.criteria.bedrooms_min IS 'ห้องนอนขั้นต่ำ';
COMMENT ON COLUMN m4_engage.criteria.center IS 'จุดศูนย์กลางจริง 🔒 ส่วนตัว';
COMMENT ON COLUMN m4_engage.criteria.display_center IS 'จุดที่แสดงให้นายหน้าเห็น (เลื่อนแล้ว)';
COMMENT ON COLUMN m4_engage.criteria.radius_m IS 'รัศมี (เมตร)';
COMMENT ON COLUMN m4_engage.criteria.landmark_id IS 'แลนด์มาร์กอ้างอิง';
COMMENT ON COLUMN m4_engage.criteria.note IS 'รายละเอียดเพิ่ม';
COMMENT ON COLUMN m4_engage.criteria.status IS 'สถานะ';
COMMENT ON COLUMN m4_engage.criteria.vip_until IS 'VIP Finder ถึง (แจ้งทันที ไม่รอสรุป 18:00)';
COMMENT ON COLUMN m4_engage.criteria.proposal_count IS 'จำนวนข้อเสนอที่ได้รับ';
COMMENT ON COLUMN m4_engage.criteria.expires_at IS 'หมดอายุ';
COMMENT ON COLUMN m4_engage.criteria.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m4_engage.criteria.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE INDEX criteria_center_gix ON m4_engage.criteria USING gist (center) WHERE status = 'active';
CREATE INDEX criteria_user_idx ON m4_engage.criteria (user_id);
CREATE INDEX criteria_expiry_idx ON m4_engage.criteria (expires_at) WHERE status = 'active';
CREATE TRIGGER criteria_set_updated_at BEFORE UPDATE ON m4_engage.criteria FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m4_engage.criteria ENABLE ROW LEVEL SECURITY;

-- ผลจับคู่
CREATE TABLE m4_engage.criteria_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criteria_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  score smallint NOT NULL CHECK (score BETWEEN 0 AND 100),
  source text NOT NULL CHECK (source IN ('listing_event', 'criteria_event')),
  notified_at timestamptz,
  digest_sent_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m4_engage.criteria_matches IS 'ผลจับคู่ — คู่ ความต้องการ × ประกาศ ที่คะแนน ≥ 80 (match.listing / match.criteria) · ไม่แจ้งซ้ำ';
COMMENT ON COLUMN m4_engage.criteria_matches.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m4_engage.criteria_matches.criteria_id IS 'ความต้องการ';
COMMENT ON COLUMN m4_engage.criteria_matches.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m4_engage.criteria_matches.score IS 'คะแนนความตรง';
COMMENT ON COLUMN m4_engage.criteria_matches.source IS 'เกิดจาก EV-03 หรือ EV-05';
COMMENT ON COLUMN m4_engage.criteria_matches.notified_at IS 'แจ้งทันที (VIP)';
COMMENT ON COLUMN m4_engage.criteria_matches.digest_sent_at IS 'ส่งในสรุป 18:00';
COMMENT ON COLUMN m4_engage.criteria_matches.dismissed_at IS 'ผู้ใช้กดไม่สนใจ';
COMMENT ON COLUMN m4_engage.criteria_matches.created_at IS 'เวลาสร้าง';
CREATE UNIQUE INDEX criteria_matches_pair_uq ON m4_engage.criteria_matches (criteria_id, listing_id);
CREATE INDEX criteria_matches_listing_idx ON m4_engage.criteria_matches (listing_id);
CREATE INDEX criteria_matches_digest_idx ON m4_engage.criteria_matches (created_at) WHERE digest_sent_at IS NULL AND notified_at IS NULL;
ALTER TABLE m4_engage.criteria_matches ENABLE ROW LEVEL SECURITY;

-- ข้อเสนอจากนายหน้า
CREATE TABLE m4_engage.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criteria_id uuid NOT NULL,
  agent_user_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  message text NOT NULL CHECK (char_length(message) <= 500),
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'viewed', 'accepted', 'declined', 'expired')),
  conversation_id uuid,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m4_engage.proposals IS 'ข้อเสนอจากนายหน้า — นายหน้าเสนอทรัพย์ให้ความต้องการ (โควตารายสัปดาห์) · ผู้ซื้อตอบรับ ➜ เปิดห้องแชท';
COMMENT ON COLUMN m4_engage.proposals.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m4_engage.proposals.criteria_id IS 'ความต้องการ';
COMMENT ON COLUMN m4_engage.proposals.agent_user_id IS 'นายหน้า';
COMMENT ON COLUMN m4_engage.proposals.listing_id IS 'ทรัพย์ที่เสนอ';
COMMENT ON COLUMN m4_engage.proposals.message IS 'ข้อความเสนอ';
COMMENT ON COLUMN m4_engage.proposals.status IS 'สถานะ';
COMMENT ON COLUMN m4_engage.proposals.conversation_id IS 'ห้องแชทที่เปิดเมื่อตอบรับ';
COMMENT ON COLUMN m4_engage.proposals.responded_at IS 'เวลาตอบ';
COMMENT ON COLUMN m4_engage.proposals.created_at IS 'เวลาสร้าง';
CREATE UNIQUE INDEX proposals_once_uq ON m4_engage.proposals (criteria_id, agent_user_id, listing_id);
CREATE INDEX proposals_quota_idx ON m4_engage.proposals (agent_user_id, created_at);
ALTER TABLE m4_engage.proposals ENABLE ROW LEVEL SECURITY;

-- คำขอ Agent Hub
CREATE TABLE m4_engage.hub_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  agent_user_id uuid NOT NULL,
  mode text NOT NULL CHECK (mode IN ('open', 'exclusive')),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'declined', 'revoked', 'expired')),
  commission_pct numeric(4,2) CHECK (commission_pct BETWEEN 0 AND 10),
  message text,
  starts_at timestamptz,
  ends_at timestamptz,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m4_engage.hub_requests IS 'คำขอ Agent Hub — นายหน้าขอรับฝากขาย + บันทึกการมอบหมาย (mandate) · Exclusive ที่อนุมัติแล้วมีได้ 1 คนต่อประกาศ';
COMMENT ON COLUMN m4_engage.hub_requests.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m4_engage.hub_requests.listing_id IS 'ประกาศ';
COMMENT ON COLUMN m4_engage.hub_requests.agent_user_id IS 'นายหน้า';
COMMENT ON COLUMN m4_engage.hub_requests.mode IS 'แบบเปิด / Exclusive';
COMMENT ON COLUMN m4_engage.hub_requests.status IS 'สถานะ';
COMMENT ON COLUMN m4_engage.hub_requests.commission_pct IS 'ค่าคอมที่ตกลง (%)';
COMMENT ON COLUMN m4_engage.hub_requests.message IS 'ข้อความถึงเจ้าของ';
COMMENT ON COLUMN m4_engage.hub_requests.starts_at IS 'เริ่มสัญญา';
COMMENT ON COLUMN m4_engage.hub_requests.ends_at IS 'สิ้นสุดสัญญา';
COMMENT ON COLUMN m4_engage.hub_requests.decided_at IS 'เวลาเจ้าของตัดสิน';
COMMENT ON COLUMN m4_engage.hub_requests.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m4_engage.hub_requests.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE UNIQUE INDEX hub_requests_open_req_uq ON m4_engage.hub_requests (listing_id, agent_user_id) WHERE status IN ('requested', 'accepted');
CREATE UNIQUE INDEX hub_requests_one_exclusive_uq ON m4_engage.hub_requests (listing_id) WHERE mode = 'exclusive' AND status = 'accepted';
CREATE INDEX hub_requests_agent_idx ON m4_engage.hub_requests (agent_user_id, status);
CREATE TRIGGER hub_requests_set_updated_at BEFORE UPDATE ON m4_engage.hub_requests FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m4_engage.hub_requests ENABLE ROW LEVEL SECURITY;

-- ห้องแชท
CREATE TABLE m4_engage.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'listing' CHECK (kind IN ('listing', 'proposal', 'hub', 'support')),
  listing_id uuid,
  last_message_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m4_engage.conversations IS 'ห้องแชท — ห้องแชทผูกกับประกาศหรือข้อเสนอ · เบอร์โทรไม่แสดงจนกว่าอนุมัติ contact_requests';
COMMENT ON COLUMN m4_engage.conversations.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m4_engage.conversations.kind IS 'ที่มาของห้อง';
COMMENT ON COLUMN m4_engage.conversations.listing_id IS 'ประกาศที่คุยถึง';
COMMENT ON COLUMN m4_engage.conversations.last_message_at IS 'ข้อความล่าสุด (เรียงกล่องแชท)';
COMMENT ON COLUMN m4_engage.conversations.created_at IS 'เวลาสร้าง';
CREATE INDEX conversations_listing_idx ON m4_engage.conversations (listing_id);
ALTER TABLE m4_engage.conversations ENABLE ROW LEVEL SECURITY;

-- สมาชิกห้องแชท
CREATE TABLE m4_engage.conversation_participants (
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('buyer', 'owner', 'agent', 'admin')),
  last_read_message_id bigint,
  muted boolean NOT NULL DEFAULT false,
  joined_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);
COMMENT ON TABLE m4_engage.conversation_participants IS 'สมาชิกห้องแชท — ผู้ร่วมห้อง + ตำแหน่งที่อ่านถึง (นับข้อความยังไม่อ่าน)';
COMMENT ON COLUMN m4_engage.conversation_participants.conversation_id IS 'ห้อง';
COMMENT ON COLUMN m4_engage.conversation_participants.user_id IS 'ผู้ใช้';
COMMENT ON COLUMN m4_engage.conversation_participants.role IS 'บทบาทในห้อง';
COMMENT ON COLUMN m4_engage.conversation_participants.last_read_message_id IS 'อ่านถึงข้อความ';
COMMENT ON COLUMN m4_engage.conversation_participants.muted IS 'ปิดเสียง';
COMMENT ON COLUMN m4_engage.conversation_participants.joined_at IS 'เวลาเข้าห้อง';
CREATE INDEX conversation_participants_user_idx ON m4_engage.conversation_participants (user_id);
ALTER TABLE m4_engage.conversation_participants ENABLE ROW LEVEL SECURITY;

-- ข้อความแชท
CREATE TABLE m4_engage.messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  conversation_id uuid NOT NULL,
  sender_user_id uuid,
  kind text NOT NULL DEFAULT 'text' CHECK (kind IN ('text', 'image', 'listing_card', 'appointment', 'system')),
  body text,
  attachment_key text,
  risk_level text NOT NULL DEFAULT 'none' CHECK (risk_level IN ('none', 'low', 'high')),
  risk_terms text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  CONSTRAINT messages_has_content_chk CHECK (kind = 'system' OR body IS NOT NULL OR attachment_key IS NOT NULL)
);
COMMENT ON TABLE m4_engage.messages IS 'ข้อความแชท — ข้อความในห้อง (bigint เรียงตามเวลา) · ตรวจคำเสี่ยงมิจฉาชีพ ➜ risk_level';
COMMENT ON COLUMN m4_engage.messages.id IS 'รหัสเลขรัน (bigint)';
COMMENT ON COLUMN m4_engage.messages.conversation_id IS 'ห้อง';
COMMENT ON COLUMN m4_engage.messages.sender_user_id IS 'ผู้ส่ง (NULL = ระบบ)';
COMMENT ON COLUMN m4_engage.messages.kind IS 'ชนิดข้อความ';
COMMENT ON COLUMN m4_engage.messages.body IS 'ข้อความ';
COMMENT ON COLUMN m4_engage.messages.attachment_key IS 'ไฟล์แนบ (R2)';
COMMENT ON COLUMN m4_engage.messages.risk_level IS 'ระดับความเสี่ยง (ขึ้นคำเตือน)';
COMMENT ON COLUMN m4_engage.messages.risk_terms IS 'คำที่ตรวจพบ เช่น โอนมัดจำก่อน';
COMMENT ON COLUMN m4_engage.messages.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m4_engage.messages.edited_at IS 'แก้ไข';
COMMENT ON COLUMN m4_engage.messages.deleted_at IS 'ลบแบบ soft delete (NULL = ยังใช้งาน)';
CREATE INDEX messages_conv_idx ON m4_engage.messages (conversation_id, id DESC);
ALTER TABLE m4_engage.messages ENABLE ROW LEVEL SECURITY;

-- คำขอเบอร์โทร
CREATE TABLE m4_engage.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  requester_user_id uuid NOT NULL,
  owner_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'expired')),
  consent_id bigint,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contact_requests_not_self_chk CHECK (requester_user_id <> owner_user_id)
);
COMMENT ON TABLE m4_engage.contact_requests IS 'คำขอเบอร์โทร — ขอดูเบอร์ในแชท ➜ เจ้าของอนุมัติ (บันทึกความยินยอม contact_share + audit)';
COMMENT ON COLUMN m4_engage.contact_requests.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m4_engage.contact_requests.conversation_id IS 'ห้อง';
COMMENT ON COLUMN m4_engage.contact_requests.requester_user_id IS 'ผู้ขอ';
COMMENT ON COLUMN m4_engage.contact_requests.owner_user_id IS 'เจ้าของเบอร์';
COMMENT ON COLUMN m4_engage.contact_requests.status IS 'สถานะ';
COMMENT ON COLUMN m4_engage.contact_requests.consent_id IS 'ความยินยอมของเจ้าของเบอร์';
COMMENT ON COLUMN m4_engage.contact_requests.decided_at IS 'เวลาตัดสิน';
COMMENT ON COLUMN m4_engage.contact_requests.created_at IS 'เวลาสร้าง';
CREATE UNIQUE INDEX contact_requests_pending_uq ON m4_engage.contact_requests (conversation_id, requester_user_id) WHERE status = 'pending';
ALTER TABLE m4_engage.contact_requests ENABLE ROW LEVEL SECURITY;

-- นัดดูทรัพย์
CREATE TABLE m4_engage.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid,
  listing_id uuid NOT NULL,
  host_user_id uuid NOT NULL,
  guest_user_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'cancelled', 'completed', 'no_show')),
  note text,
  reminder_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT appointments_period_valid_chk CHECK (ends_at > starts_at),
  CONSTRAINT appointments_not_self_chk CHECK (host_user_id <> guest_user_id)
);
COMMENT ON TABLE m4_engage.appointments IS 'นัดดูทรัพย์ — นัดหมายดูทรัพย์ · ฐานข้อมูลกันนัดชนกันของผู้รับนัด (EXCLUDE)';
COMMENT ON COLUMN m4_engage.appointments.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m4_engage.appointments.conversation_id IS 'ห้องแชทที่นัด';
COMMENT ON COLUMN m4_engage.appointments.listing_id IS 'ทรัพย์';
COMMENT ON COLUMN m4_engage.appointments.host_user_id IS 'ผู้รับนัด (เจ้าของ/นายหน้า)';
COMMENT ON COLUMN m4_engage.appointments.guest_user_id IS 'ผู้ขอนัด';
COMMENT ON COLUMN m4_engage.appointments.starts_at IS 'เริ่ม';
COMMENT ON COLUMN m4_engage.appointments.ends_at IS 'สิ้นสุด';
COMMENT ON COLUMN m4_engage.appointments.status IS 'สถานะ (เลื่อนนัด = ยกเลิกแล้วสร้างใหม่)';
COMMENT ON COLUMN m4_engage.appointments.note IS 'หมายเหตุ';
COMMENT ON COLUMN m4_engage.appointments.reminder_sent_at IS 'ส่งเตือนก่อนนัด';
COMMENT ON COLUMN m4_engage.appointments.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m4_engage.appointments.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
ALTER TABLE m4_engage.appointments ADD CONSTRAINT appointments_no_overlap EXCLUDE USING gist (host_user_id WITH =, tstzrange(starts_at, ends_at) WITH &&) WHERE (status IN ('requested', 'confirmed'));
CREATE INDEX appointments_guest_idx ON m4_engage.appointments (guest_user_id, starts_at);
CREATE TRIGGER appointments_set_updated_at BEFORE UPDATE ON m4_engage.appointments FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m4_engage.appointments ENABLE ROW LEVEL SECURITY;

-- รีวิว
CREATE TABLE m4_engage.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL,
  reviewer_user_id uuid NOT NULL,
  reviewee_user_id uuid NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reviews_not_self_chk CHECK (reviewer_user_id <> reviewee_user_id)
);
COMMENT ON TABLE m4_engage.reviews IS 'รีวิว — รีวิวหลังนัดดูเสร็จ (1 คนรีวิวได้ 1 ครั้งต่อนัด) ➜ อัปเดตคะแนนนายหน้า';
COMMENT ON COLUMN m4_engage.reviews.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m4_engage.reviews.appointment_id IS 'นัดที่เกิดขึ้นจริง';
COMMENT ON COLUMN m4_engage.reviews.reviewer_user_id IS 'ผู้รีวิว';
COMMENT ON COLUMN m4_engage.reviews.reviewee_user_id IS 'ผู้ถูกรีวิว';
COMMENT ON COLUMN m4_engage.reviews.rating IS 'คะแนน 1–5';
COMMENT ON COLUMN m4_engage.reviews.comment IS 'ความเห็น';
COMMENT ON COLUMN m4_engage.reviews.status IS 'สถานะ';
COMMENT ON COLUMN m4_engage.reviews.created_at IS 'เวลาสร้าง';
CREATE UNIQUE INDEX reviews_once_uq ON m4_engage.reviews (appointment_id, reviewer_user_id);
CREATE INDEX reviews_reviewee_idx ON m4_engage.reviews (reviewee_user_id, created_at DESC);
ALTER TABLE m4_engage.reviews ENABLE ROW LEVEL SECURITY;

-- การบล็อก
CREATE TABLE m4_engage.blocks (
  blocker_user_id uuid NOT NULL,
  blocked_user_id uuid NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_user_id, blocked_user_id),
  CONSTRAINT blocks_not_self_chk CHECK (blocker_user_id <> blocked_user_id)
);
COMMENT ON TABLE m4_engage.blocks IS 'การบล็อก — ผู้ใช้บล็อกกัน ➜ ส่งแชท/ข้อเสนอไม่ได้';
COMMENT ON COLUMN m4_engage.blocks.blocker_user_id IS 'ผู้บล็อก';
COMMENT ON COLUMN m4_engage.blocks.blocked_user_id IS 'ผู้ถูกบล็อก';
COMMENT ON COLUMN m4_engage.blocks.reason IS 'เหตุผล';
COMMENT ON COLUMN m4_engage.blocks.created_at IS 'เวลาสร้าง';
ALTER TABLE m4_engage.blocks ENABLE ROW LEVEL SECURITY;

-- แพ็กเกจ
CREATE TABLE m5_commerce.packages (
  code text PRIMARY KEY,
  name_th text NOT NULL,
  name_en text,
  audience text NOT NULL CHECK (audience IN ('owner', 'agent', 'buyer')),
  price_satang int NOT NULL CHECK (price_satang >= 0),
  duration_days int CHECK (duration_days > 0),
  entitlements jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m5_commerce.packages IS 'แพ็กเกจ — สินค้าที่ขาย: โควตาประกาศ ดัน Spotlight VIP ฯลฯ · แอดมินปรับราคา/สิทธิ์ได้ (S65)';
COMMENT ON COLUMN m5_commerce.packages.code IS 'รหัส เช่น owner_boost_7d';
COMMENT ON COLUMN m5_commerce.packages.name_th IS 'ชื่อแพ็กเกจ (ไทย)';
COMMENT ON COLUMN m5_commerce.packages.name_en IS 'ชื่อแพ็กเกจ (อังกฤษ) เช่น Boost 7 Days, Pro Agent Monthly';
COMMENT ON COLUMN m5_commerce.packages.audience IS 'กลุ่มผู้ซื้อ';
COMMENT ON COLUMN m5_commerce.packages.price_satang IS 'ราคา (สตางค์ รวม VAT)';
COMMENT ON COLUMN m5_commerce.packages.duration_days IS 'อายุสิทธิ์ (วัน)';
COMMENT ON COLUMN m5_commerce.packages.entitlements IS 'สิทธิ์ที่ได้ เช่น [{kind: listing_quota, qty: 5}]';
COMMENT ON COLUMN m5_commerce.packages.is_active IS 'เปิดขาย';
COMMENT ON COLUMN m5_commerce.packages.sale_starts_at IS 'Flash Sale เริ่ม';
COMMENT ON COLUMN m5_commerce.packages.sale_ends_at IS 'Flash Sale สิ้นสุด';
COMMENT ON COLUMN m5_commerce.packages.sort_order IS 'ลำดับแสดง';
COMMENT ON COLUMN m5_commerce.packages.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m5_commerce.packages.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE TRIGGER packages_set_updated_at BEFORE UPDATE ON m5_commerce.packages FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m5_commerce.packages ENABLE ROW LEVEL SECURITY;

-- คูปองส่วนลด
CREATE TABLE m5_commerce.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code citext NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value int NOT NULL CHECK (discount_value > 0),
  max_discount_satang int,
  min_subtotal_satang int NOT NULL DEFAULT 0,
  applies_to text[] NOT NULL DEFAULT '{}',
  usage_limit int,
  used_count int NOT NULL DEFAULT 0,
  per_user_limit int NOT NULL DEFAULT 1,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT coupons_percent_max_100_chk CHECK (discount_type <> 'percent' OR discount_value <= 100)
);
COMMENT ON TABLE m5_commerce.coupons IS 'คูปองส่วนลด — โค้ดส่วนลด % หรือจำนวนเงิน · จำกัดจำนวนครั้ง/ต่อคน/ช่วงเวลา';
COMMENT ON COLUMN m5_commerce.coupons.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m5_commerce.coupons.code IS 'โค้ด';
COMMENT ON COLUMN m5_commerce.coupons.discount_type IS 'ลดเป็น % / บาท';
COMMENT ON COLUMN m5_commerce.coupons.discount_value IS 'มูลค่า (% หรือสตางค์)';
COMMENT ON COLUMN m5_commerce.coupons.max_discount_satang IS 'ลดสูงสุด';
COMMENT ON COLUMN m5_commerce.coupons.min_subtotal_satang IS 'ยอดขั้นต่ำ';
COMMENT ON COLUMN m5_commerce.coupons.applies_to IS 'แพ็กเกจที่ใช้ได้ (ว่าง = ทุกแพ็กเกจ)';
COMMENT ON COLUMN m5_commerce.coupons.usage_limit IS 'ใช้ได้ทั้งหมดกี่ครั้ง';
COMMENT ON COLUMN m5_commerce.coupons.used_count IS 'ใช้ไปแล้ว';
COMMENT ON COLUMN m5_commerce.coupons.per_user_limit IS 'ต่อคน';
COMMENT ON COLUMN m5_commerce.coupons.starts_at IS 'เริ่ม';
COMMENT ON COLUMN m5_commerce.coupons.ends_at IS 'สิ้นสุด';
COMMENT ON COLUMN m5_commerce.coupons.is_active IS 'เปิดใช้';
COMMENT ON COLUMN m5_commerce.coupons.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m5_commerce.coupons.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE TRIGGER coupons_set_updated_at BEFORE UPDATE ON m5_commerce.coupons FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m5_commerce.coupons ENABLE ROW LEVEL SECURITY;

-- ตะกร้า
CREATE TABLE m5_commerce.carts (
  user_id uuid PRIMARY KEY,
  coupon_id uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m5_commerce.carts IS 'ตะกร้า — ตะกร้า 1 ใบต่อผู้ใช้';
COMMENT ON COLUMN m5_commerce.carts.user_id IS 'เจ้าของตะกร้า';
COMMENT ON COLUMN m5_commerce.carts.coupon_id IS 'คูปองที่ใส่';
COMMENT ON COLUMN m5_commerce.carts.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE TRIGGER carts_set_updated_at BEFORE UPDATE ON m5_commerce.carts FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m5_commerce.carts ENABLE ROW LEVEL SECURITY;

-- สินค้าในตะกร้า
CREATE TABLE m5_commerce.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_user_id uuid NOT NULL,
  package_code text NOT NULL,
  qty smallint NOT NULL DEFAULT 1 CHECK (qty BETWEEN 1 AND 10),
  target_listing_id uuid,
  added_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m5_commerce.cart_items IS 'สินค้าในตะกร้า — แพ็กเกจในตะกร้า · ดัน/Spotlight ต้องระบุประกาศเป้าหมาย';
COMMENT ON COLUMN m5_commerce.cart_items.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m5_commerce.cart_items.cart_user_id IS 'ตะกร้า';
COMMENT ON COLUMN m5_commerce.cart_items.package_code IS 'แพ็กเกจ';
COMMENT ON COLUMN m5_commerce.cart_items.qty IS 'จำนวน';
COMMENT ON COLUMN m5_commerce.cart_items.target_listing_id IS 'ประกาศเป้าหมาย';
COMMENT ON COLUMN m5_commerce.cart_items.added_at IS 'เวลาใส่ตะกร้า';
CREATE INDEX cart_items_cart_idx ON m5_commerce.cart_items (cart_user_id);
ALTER TABLE m5_commerce.cart_items ENABLE ROW LEVEL SECURITY;

-- คำสั่งซื้อ
CREATE TABLE m5_commerce.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no text NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'paid', 'fulfilled', 'expired', 'cancelled', 'refunded')),
  subtotal_satang int NOT NULL CHECK (subtotal_satang >= 0),
  discount_satang int NOT NULL DEFAULT 0 CHECK (discount_satang >= 0),
  vat_satang int NOT NULL DEFAULT 0 CHECK (vat_satang >= 0),
  total_satang int NOT NULL CHECK (total_satang >= 0),
  coupon_id uuid,
  payment_method text NOT NULL DEFAULT 'promptpay' CHECK (payment_method IN ('promptpay', 'card')),
  omise_charge_id text UNIQUE,
  qr_expires_at timestamptz,
  paid_at timestamptz,
  fulfilled_at timestamptz,
  cancelled_at timestamptz,
  receipt_no text UNIQUE,
  tax_invoice jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT orders_total_formula_chk CHECK (total_satang = subtotal_satang - discount_satang + vat_satang)
);
COMMENT ON TABLE m5_commerce.orders IS 'คำสั่งซื้อ — ออเดอร์ + QR PromptPay (Omise) หมดอายุ 15 นาที · ยืนยันยอดผ่าน Webhook เท่านั้น';
COMMENT ON COLUMN m5_commerce.orders.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m5_commerce.orders.order_no IS 'เลขออเดอร์ เช่น MN-20261006-0001';
COMMENT ON COLUMN m5_commerce.orders.user_id IS 'ผู้ซื้อ';
COMMENT ON COLUMN m5_commerce.orders.status IS 'สถานะ';
COMMENT ON COLUMN m5_commerce.orders.subtotal_satang IS 'ยอดก่อน VAT';
COMMENT ON COLUMN m5_commerce.orders.discount_satang IS 'ส่วนลด';
COMMENT ON COLUMN m5_commerce.orders.vat_satang IS 'VAT 7%';
COMMENT ON COLUMN m5_commerce.orders.total_satang IS 'ยอดชำระ';
COMMENT ON COLUMN m5_commerce.orders.coupon_id IS 'คูปอง';
COMMENT ON COLUMN m5_commerce.orders.payment_method IS 'วิธีชำระ';
COMMENT ON COLUMN m5_commerce.orders.omise_charge_id IS 'รหัส charge ของ Omise';
COMMENT ON COLUMN m5_commerce.orders.qr_expires_at IS 'QR หมดอายุ (งาน order.expire)';
COMMENT ON COLUMN m5_commerce.orders.paid_at IS 'เวลาชำระ';
COMMENT ON COLUMN m5_commerce.orders.fulfilled_at IS 'เวลาเปิดสิทธิ์';
COMMENT ON COLUMN m5_commerce.orders.cancelled_at IS 'เวลายกเลิก/หมดอายุ';
COMMENT ON COLUMN m5_commerce.orders.receipt_no IS 'เลขใบเสร็จ';
COMMENT ON COLUMN m5_commerce.orders.tax_invoice IS 'ข้อมูลใบกำกับภาษี (ชื่อ · เลขผู้เสียภาษี · ที่อยู่)';
COMMENT ON COLUMN m5_commerce.orders.created_at IS 'เวลาสร้าง';
COMMENT ON COLUMN m5_commerce.orders.updated_at IS 'เวลาแก้ไขล่าสุด (trigger อัปเดตให้)';
CREATE INDEX orders_user_idx ON m5_commerce.orders (user_id, created_at DESC);
CREATE INDEX orders_pending_idx ON m5_commerce.orders (qr_expires_at) WHERE status = 'pending_payment';
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON m5_commerce.orders FOR EACH ROW EXECUTE FUNCTION core.set_updated_at();
ALTER TABLE m5_commerce.orders ENABLE ROW LEVEL SECURITY;

-- รายการในออเดอร์
CREATE TABLE m5_commerce.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  package_code text NOT NULL,
  package_name text NOT NULL,
  unit_price_satang int NOT NULL CHECK (unit_price_satang >= 0),
  qty smallint NOT NULL DEFAULT 1 CHECK (qty > 0),
  line_total_satang int NOT NULL,
  entitlements_snapshot jsonb NOT NULL,
  target_listing_id uuid,
  CONSTRAINT order_items_line_total_formula_chk CHECK (line_total_satang = unit_price_satang * qty)
);
COMMENT ON TABLE m5_commerce.order_items IS 'รายการในออเดอร์ — สำเนาชื่อ/ราคา/สิทธิ์ ณ เวลาซื้อ (แพ็กเกจเปลี่ยนภายหลังไม่กระทบ)';
COMMENT ON COLUMN m5_commerce.order_items.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m5_commerce.order_items.order_id IS 'ออเดอร์';
COMMENT ON COLUMN m5_commerce.order_items.package_code IS 'แพ็กเกจ';
COMMENT ON COLUMN m5_commerce.order_items.package_name IS 'ชื่อ ณ เวลาซื้อ';
COMMENT ON COLUMN m5_commerce.order_items.unit_price_satang IS 'ราคาต่อหน่วย';
COMMENT ON COLUMN m5_commerce.order_items.qty IS 'จำนวน';
COMMENT ON COLUMN m5_commerce.order_items.line_total_satang IS 'รวมบรรทัด';
COMMENT ON COLUMN m5_commerce.order_items.entitlements_snapshot IS 'สิทธิ์ ณ เวลาซื้อ';
COMMENT ON COLUMN m5_commerce.order_items.target_listing_id IS 'ประกาศเป้าหมาย';
CREATE INDEX order_items_order_idx ON m5_commerce.order_items (order_id);
ALTER TABLE m5_commerce.order_items ENABLE ROW LEVEL SECURITY;

-- Webhook การชำระเงิน
CREATE TABLE m5_commerce.payment_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  provider text NOT NULL DEFAULT 'omise',
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  order_id uuid,
  signature_ok boolean NOT NULL,
  payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  error text
);
COMMENT ON TABLE m5_commerce.payment_events IS 'Webhook การชำระเงิน — ทุก Webhook ที่ได้รับ · unique ต่อ event กันประมวลผลซ้ำ (idempotent)';
COMMENT ON COLUMN m5_commerce.payment_events.id IS 'รหัสเลขรัน (bigint)';
COMMENT ON COLUMN m5_commerce.payment_events.provider IS 'ผู้ให้บริการ';
COMMENT ON COLUMN m5_commerce.payment_events.provider_event_id IS 'รหัส event ฝั่งผู้ให้บริการ';
COMMENT ON COLUMN m5_commerce.payment_events.event_type IS 'เช่น charge.complete';
COMMENT ON COLUMN m5_commerce.payment_events.order_id IS 'ออเดอร์ที่เกี่ยวข้อง';
COMMENT ON COLUMN m5_commerce.payment_events.signature_ok IS 'ลายเซ็นถูกต้อง';
COMMENT ON COLUMN m5_commerce.payment_events.payload IS 'ข้อมูลดิบ';
COMMENT ON COLUMN m5_commerce.payment_events.received_at IS 'เวลารับ';
COMMENT ON COLUMN m5_commerce.payment_events.processed_at IS 'ประมวลผลเสร็จ';
COMMENT ON COLUMN m5_commerce.payment_events.error IS 'ข้อผิดพลาด';
CREATE UNIQUE INDEX payment_events_idempotent_uq ON m5_commerce.payment_events (provider, provider_event_id);
CREATE INDEX payment_events_order_idx ON m5_commerce.payment_events (order_id);
ALTER TABLE m5_commerce.payment_events ENABLE ROW LEVEL SECURITY;

-- การคืนเงิน
CREATE TABLE m5_commerce.refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  amount_satang int NOT NULL CHECK (amount_satang > 0),
  reason text NOT NULL CHECK (reason IN ('late_payment', 'duplicate', 'customer_request', 'admin_adjust')),
  status text NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'processing', 'succeeded', 'failed')),
  provider_refund_id text UNIQUE,
  requested_by uuid,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m5_commerce.refunds IS 'การคืนเงิน — คืนเงิน เช่น จ่ายหลัง QR หมดอายุ / จ่ายซ้ำ (S66)';
COMMENT ON COLUMN m5_commerce.refunds.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m5_commerce.refunds.order_id IS 'ออเดอร์';
COMMENT ON COLUMN m5_commerce.refunds.amount_satang IS 'จำนวนเงิน';
COMMENT ON COLUMN m5_commerce.refunds.reason IS 'เหตุผล';
COMMENT ON COLUMN m5_commerce.refunds.status IS 'สถานะ';
COMMENT ON COLUMN m5_commerce.refunds.provider_refund_id IS 'รหัสคืนเงินของ Omise';
COMMENT ON COLUMN m5_commerce.refunds.requested_by IS 'ผู้สั่งคืน';
COMMENT ON COLUMN m5_commerce.refunds.completed_at IS 'เวลาสำเร็จ';
COMMENT ON COLUMN m5_commerce.refunds.created_at IS 'เวลาสร้าง';
CREATE INDEX refunds_order_idx ON m5_commerce.refunds (order_id);
ALTER TABLE m5_commerce.refunds ENABLE ROW LEVEL SECURITY;

-- สิทธิ์ใช้งาน
CREATE TABLE m5_commerce.entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('listing_quota', 'boost', 'spotlight', 'vip_finder', 'pitch_quota', 'microsite', 'pdf_no_watermark', 'exclusive_hub', 'team_seats')),
  source text NOT NULL CHECK (source IN ('purchase', 'free_tier', 'admin_grant', 'promo')),
  order_item_id uuid,
  quantity int CHECK (quantity >= 0),
  remaining int,
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT entitlements_remaining_valid_chk CHECK (remaining IS NULL OR (remaining >= 0 AND quantity IS NOT NULL AND remaining <= quantity))
);
COMMENT ON TABLE m5_commerce.entitlements IS 'สิทธิ์ใช้งาน — สิทธิ์ที่ผู้ใช้ถืออยู่ (จากการซื้อ / ฟรี 2 ประกาศ / แอดมินให้) · หักทีละหน่วยผ่าน entitlement_usages';
COMMENT ON COLUMN m5_commerce.entitlements.id IS 'รหัส (UUID)';
COMMENT ON COLUMN m5_commerce.entitlements.user_id IS 'เจ้าของสิทธิ์';
COMMENT ON COLUMN m5_commerce.entitlements.kind IS 'ชนิดสิทธิ์';
COMMENT ON COLUMN m5_commerce.entitlements.source IS 'ที่มา';
COMMENT ON COLUMN m5_commerce.entitlements.order_item_id IS 'รายการที่ซื้อ (NULL = ไม่ได้ซื้อ)';
COMMENT ON COLUMN m5_commerce.entitlements.quantity IS 'จำนวนที่ได้ (NULL = สิทธิ์แบบช่วงเวลา)';
COMMENT ON COLUMN m5_commerce.entitlements.remaining IS 'คงเหลือ';
COMMENT ON COLUMN m5_commerce.entitlements.starts_at IS 'เริ่มใช้ได้';
COMMENT ON COLUMN m5_commerce.entitlements.expires_at IS 'หมดอายุ';
COMMENT ON COLUMN m5_commerce.entitlements.created_at IS 'เวลาสร้าง';
CREATE INDEX entitlements_user_kind_idx ON m5_commerce.entitlements (user_id, kind, expires_at);
ALTER TABLE m5_commerce.entitlements ENABLE ROW LEVEL SECURITY;

-- การใช้สิทธิ์
CREATE TABLE m5_commerce.entitlement_usages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entitlement_id uuid NOT NULL,
  used_qty int NOT NULL DEFAULT 1 CHECK (used_qty > 0),
  ref_type text NOT NULL,
  ref_id text NOT NULL,
  reversed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE m5_commerce.entitlement_usages IS 'การใช้สิทธิ์ — ทุกครั้งที่หักสิทธิ์ (ลงประกาศ · ดัน · เสนอทรัพย์) · ยกเลิกได้ด้วย reversed_at';
COMMENT ON COLUMN m5_commerce.entitlement_usages.id IS 'รหัสเลขรัน (bigint)';
COMMENT ON COLUMN m5_commerce.entitlement_usages.entitlement_id IS 'สิทธิ์';
COMMENT ON COLUMN m5_commerce.entitlement_usages.used_qty IS 'จำนวนที่ใช้';
COMMENT ON COLUMN m5_commerce.entitlement_usages.ref_type IS 'ใช้กับอะไร เช่น listing · proposal';
COMMENT ON COLUMN m5_commerce.entitlement_usages.ref_id IS 'รหัสสิ่งที่ใช้';
COMMENT ON COLUMN m5_commerce.entitlement_usages.reversed_at IS 'คืนสิทธิ์';
COMMENT ON COLUMN m5_commerce.entitlement_usages.created_at IS 'เวลาสร้าง';
CREATE INDEX entitlement_usages_ent_idx ON m5_commerce.entitlement_usages (entitlement_id);
ALTER TABLE m5_commerce.entitlement_usages ENABLE ROW LEVEL SECURITY;

-- ===================== foreign keys
ALTER TABLE core.admin_areas ADD CONSTRAINT admin_areas_parent_code_fkey FOREIGN KEY (parent_code) REFERENCES core.admin_areas (code);
ALTER TABLE core.landmarks ADD CONSTRAINT landmarks_subdistrict_code_fkey FOREIGN KEY (subdistrict_code) REFERENCES core.admin_areas (code);
ALTER TABLE core.notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE core.reports ADD CONSTRAINT reports_reporter_user_id_fkey FOREIGN KEY (reporter_user_id) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE core.reports ADD CONSTRAINT reports_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE core.audit_logs ADD CONSTRAINT audit_logs_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE core.settings ADD CONSTRAINT settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m1_identity.user_roles ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;
ALTER TABLE m1_identity.user_roles ADD CONSTRAINT user_roles_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES m1_identity.users (id) ON DELETE SET NULL;
ALTER TABLE m1_identity.auth_accounts ADD CONSTRAINT auth_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;
ALTER TABLE m1_identity.sessions ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;
ALTER TABLE m1_identity.agent_profiles ADD CONSTRAINT agent_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;
ALTER TABLE m1_identity.kyc_submissions ADD CONSTRAINT kyc_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;
ALTER TABLE m1_identity.kyc_submissions ADD CONSTRAINT kyc_submissions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES m1_identity.users (id) ON DELETE SET NULL;
ALTER TABLE m1_identity.consents ADD CONSTRAINT consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id);
ALTER TABLE m1_identity.push_subscriptions ADD CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;
ALTER TABLE m1_identity.teams ADD CONSTRAINT teams_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES m1_identity.users (id);
ALTER TABLE m1_identity.team_members ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES m1_identity.teams (id) ON DELETE CASCADE;
ALTER TABLE m1_identity.team_members ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;
ALTER TABLE m2_listing.projects ADD CONSTRAINT projects_property_type_code_fkey FOREIGN KEY (property_type_code) REFERENCES m2_listing.property_types (code);
ALTER TABLE m2_listing.projects ADD CONSTRAINT projects_subdistrict_code_fkey FOREIGN KEY (subdistrict_code) REFERENCES core.admin_areas (code);  -- cross-module
ALTER TABLE m2_listing.projects ADD CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m2_listing.listing_units ADD CONSTRAINT listing_units_project_id_fkey FOREIGN KEY (project_id) REFERENCES m2_listing.projects (id) ON DELETE SET NULL;
ALTER TABLE m2_listing.listings ADD CONSTRAINT listings_poster_user_id_fkey FOREIGN KEY (poster_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m2_listing.listings ADD CONSTRAINT listings_team_id_fkey FOREIGN KEY (team_id) REFERENCES m1_identity.teams (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m2_listing.listings ADD CONSTRAINT listings_property_type_code_fkey FOREIGN KEY (property_type_code) REFERENCES m2_listing.property_types (code);
ALTER TABLE m2_listing.listings ADD CONSTRAINT listings_project_id_fkey FOREIGN KEY (project_id) REFERENCES m2_listing.projects (id) ON DELETE SET NULL;
ALTER TABLE m2_listing.listings ADD CONSTRAINT listings_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES m2_listing.listing_units (id) ON DELETE SET NULL;
ALTER TABLE m2_listing.listings ADD CONSTRAINT listings_province_code_fkey FOREIGN KEY (province_code) REFERENCES core.admin_areas (code);  -- cross-module
ALTER TABLE m2_listing.listings ADD CONSTRAINT listings_district_code_fkey FOREIGN KEY (district_code) REFERENCES core.admin_areas (code);  -- cross-module
ALTER TABLE m2_listing.listings ADD CONSTRAINT listings_subdistrict_code_fkey FOREIGN KEY (subdistrict_code) REFERENCES core.admin_areas (code);  -- cross-module
ALTER TABLE m2_listing.listing_amenities ADD CONSTRAINT listing_amenities_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;
ALTER TABLE m2_listing.listing_amenities ADD CONSTRAINT listing_amenities_amenity_code_fkey FOREIGN KEY (amenity_code) REFERENCES m2_listing.amenities (code);
ALTER TABLE m2_listing.listing_photos ADD CONSTRAINT listing_photos_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;
ALTER TABLE m2_listing.listing_status_history ADD CONSTRAINT listing_status_history_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;
ALTER TABLE m2_listing.listing_status_history ADD CONSTRAINT listing_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m2_listing.listing_documents ADD CONSTRAINT listing_documents_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;
ALTER TABLE m2_listing.listing_documents ADD CONSTRAINT listing_documents_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m2_listing.listing_daily_stats ADD CONSTRAINT listing_daily_stats_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;
ALTER TABLE m2_listing.listing_boosts ADD CONSTRAINT listing_boosts_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;
ALTER TABLE m2_listing.listing_boosts ADD CONSTRAINT listing_boosts_entitlement_id_fkey FOREIGN KEY (entitlement_id) REFERENCES m5_commerce.entitlements (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m3_discovery.listing_index ADD CONSTRAINT listing_index_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m3_discovery.favorites ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m3_discovery.favorites ADD CONSTRAINT favorites_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m3_discovery.waitlist_entries ADD CONSTRAINT waitlist_entries_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m3_discovery.waitlist_entries ADD CONSTRAINT waitlist_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m3_discovery.mortgage_leads ADD CONSTRAINT mortgage_leads_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m3_discovery.mortgage_leads ADD CONSTRAINT mortgage_leads_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m3_discovery.mortgage_leads ADD CONSTRAINT mortgage_leads_consent_id_fkey FOREIGN KEY (consent_id) REFERENCES m1_identity.consents (id);  -- cross-module
ALTER TABLE m4_engage.criteria ADD CONSTRAINT criteria_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m4_engage.criteria ADD CONSTRAINT criteria_landmark_id_fkey FOREIGN KEY (landmark_id) REFERENCES core.landmarks (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m4_engage.criteria_matches ADD CONSTRAINT criteria_matches_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES m4_engage.criteria (id) ON DELETE CASCADE;
ALTER TABLE m4_engage.criteria_matches ADD CONSTRAINT criteria_matches_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m4_engage.proposals ADD CONSTRAINT proposals_criteria_id_fkey FOREIGN KEY (criteria_id) REFERENCES m4_engage.criteria (id) ON DELETE CASCADE;
ALTER TABLE m4_engage.proposals ADD CONSTRAINT proposals_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m4_engage.proposals ADD CONSTRAINT proposals_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m4_engage.proposals ADD CONSTRAINT proposals_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES m4_engage.conversations (id) ON DELETE SET NULL;
ALTER TABLE m4_engage.hub_requests ADD CONSTRAINT hub_requests_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m4_engage.hub_requests ADD CONSTRAINT hub_requests_agent_user_id_fkey FOREIGN KEY (agent_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m4_engage.conversations ADD CONSTRAINT conversations_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m4_engage.conversation_participants ADD CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES m4_engage.conversations (id) ON DELETE CASCADE;
ALTER TABLE m4_engage.conversation_participants ADD CONSTRAINT conversation_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m4_engage.messages ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES m4_engage.conversations (id) ON DELETE CASCADE;
ALTER TABLE m4_engage.messages ADD CONSTRAINT messages_sender_user_id_fkey FOREIGN KEY (sender_user_id) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m4_engage.contact_requests ADD CONSTRAINT contact_requests_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES m4_engage.conversations (id) ON DELETE CASCADE;
ALTER TABLE m4_engage.contact_requests ADD CONSTRAINT contact_requests_requester_user_id_fkey FOREIGN KEY (requester_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m4_engage.contact_requests ADD CONSTRAINT contact_requests_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m4_engage.contact_requests ADD CONSTRAINT contact_requests_consent_id_fkey FOREIGN KEY (consent_id) REFERENCES m1_identity.consents (id);  -- cross-module
ALTER TABLE m4_engage.appointments ADD CONSTRAINT appointments_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES m4_engage.conversations (id) ON DELETE SET NULL;
ALTER TABLE m4_engage.appointments ADD CONSTRAINT appointments_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m4_engage.appointments ADD CONSTRAINT appointments_host_user_id_fkey FOREIGN KEY (host_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m4_engage.appointments ADD CONSTRAINT appointments_guest_user_id_fkey FOREIGN KEY (guest_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m4_engage.reviews ADD CONSTRAINT reviews_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES m4_engage.appointments (id) ON DELETE CASCADE;
ALTER TABLE m4_engage.reviews ADD CONSTRAINT reviews_reviewer_user_id_fkey FOREIGN KEY (reviewer_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m4_engage.reviews ADD CONSTRAINT reviews_reviewee_user_id_fkey FOREIGN KEY (reviewee_user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m4_engage.blocks ADD CONSTRAINT blocks_blocker_user_id_fkey FOREIGN KEY (blocker_user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m4_engage.blocks ADD CONSTRAINT blocks_blocked_user_id_fkey FOREIGN KEY (blocked_user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m5_commerce.carts ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m5_commerce.carts ADD CONSTRAINT carts_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES m5_commerce.coupons (id) ON DELETE SET NULL;
ALTER TABLE m5_commerce.cart_items ADD CONSTRAINT cart_items_cart_user_id_fkey FOREIGN KEY (cart_user_id) REFERENCES m5_commerce.carts (user_id) ON DELETE CASCADE;
ALTER TABLE m5_commerce.cart_items ADD CONSTRAINT cart_items_package_code_fkey FOREIGN KEY (package_code) REFERENCES m5_commerce.packages (code);
ALTER TABLE m5_commerce.cart_items ADD CONSTRAINT cart_items_target_listing_id_fkey FOREIGN KEY (target_listing_id) REFERENCES m2_listing.listings (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m5_commerce.orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id);  -- cross-module
ALTER TABLE m5_commerce.orders ADD CONSTRAINT orders_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES m5_commerce.coupons (id) ON DELETE SET NULL;
ALTER TABLE m5_commerce.order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES m5_commerce.orders (id) ON DELETE CASCADE;
ALTER TABLE m5_commerce.order_items ADD CONSTRAINT order_items_package_code_fkey FOREIGN KEY (package_code) REFERENCES m5_commerce.packages (code);
ALTER TABLE m5_commerce.order_items ADD CONSTRAINT order_items_target_listing_id_fkey FOREIGN KEY (target_listing_id) REFERENCES m2_listing.listings (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m5_commerce.payment_events ADD CONSTRAINT payment_events_order_id_fkey FOREIGN KEY (order_id) REFERENCES m5_commerce.orders (id) ON DELETE SET NULL;
ALTER TABLE m5_commerce.refunds ADD CONSTRAINT refunds_order_id_fkey FOREIGN KEY (order_id) REFERENCES m5_commerce.orders (id);
ALTER TABLE m5_commerce.refunds ADD CONSTRAINT refunds_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES m1_identity.users (id) ON DELETE SET NULL;  -- cross-module
ALTER TABLE m5_commerce.entitlements ADD CONSTRAINT entitlements_user_id_fkey FOREIGN KEY (user_id) REFERENCES m1_identity.users (id) ON DELETE CASCADE;  -- cross-module
ALTER TABLE m5_commerce.entitlements ADD CONSTRAINT entitlements_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES m5_commerce.order_items (id) ON DELETE SET NULL;
ALTER TABLE m5_commerce.entitlement_usages ADD CONSTRAINT entitlement_usages_entitlement_id_fkey FOREIGN KEY (entitlement_id) REFERENCES m5_commerce.entitlements (id) ON DELETE CASCADE;

-- ===================== indexes for FK columns not already leading an index
CREATE INDEX landmarks_subdistrict_code_fk_idx ON core.landmarks (subdistrict_code);
CREATE INDEX reports_reporter_user_id_fk_idx ON core.reports (reporter_user_id);
CREATE INDEX reports_resolved_by_fk_idx ON core.reports (resolved_by);
CREATE INDEX settings_updated_by_fk_idx ON core.settings (updated_by);
CREATE INDEX user_roles_granted_by_fk_idx ON m1_identity.user_roles (granted_by);
CREATE INDEX kyc_submissions_reviewed_by_fk_idx ON m1_identity.kyc_submissions (reviewed_by);
CREATE INDEX teams_owner_user_id_fk_idx ON m1_identity.teams (owner_user_id);
CREATE INDEX projects_property_type_code_fk_idx ON m2_listing.projects (property_type_code);
CREATE INDEX projects_subdistrict_code_fk_idx ON m2_listing.projects (subdistrict_code);
CREATE INDEX projects_created_by_fk_idx ON m2_listing.projects (created_by);
CREATE INDEX listings_team_id_fk_idx ON m2_listing.listings (team_id);
CREATE INDEX listings_property_type_code_fk_idx ON m2_listing.listings (property_type_code);
CREATE INDEX listings_province_code_fk_idx ON m2_listing.listings (province_code);
CREATE INDEX listings_district_code_fk_idx ON m2_listing.listings (district_code);
CREATE INDEX listings_subdistrict_code_fk_idx ON m2_listing.listings (subdistrict_code);
CREATE INDEX listing_amenities_amenity_code_fk_idx ON m2_listing.listing_amenities (amenity_code);
CREATE INDEX listing_status_history_changed_by_fk_idx ON m2_listing.listing_status_history (changed_by);
CREATE INDEX listing_documents_verified_by_fk_idx ON m2_listing.listing_documents (verified_by);
CREATE INDEX listing_boosts_entitlement_id_fk_idx ON m2_listing.listing_boosts (entitlement_id);
CREATE INDEX waitlist_entries_user_id_fk_idx ON m3_discovery.waitlist_entries (user_id);
CREATE INDEX mortgage_leads_user_id_fk_idx ON m3_discovery.mortgage_leads (user_id);
CREATE INDEX mortgage_leads_listing_id_fk_idx ON m3_discovery.mortgage_leads (listing_id);
CREATE INDEX mortgage_leads_consent_id_fk_idx ON m3_discovery.mortgage_leads (consent_id);
CREATE INDEX criteria_landmark_id_fk_idx ON m4_engage.criteria (landmark_id);
CREATE INDEX proposals_listing_id_fk_idx ON m4_engage.proposals (listing_id);
CREATE INDEX proposals_conversation_id_fk_idx ON m4_engage.proposals (conversation_id);
CREATE INDEX messages_sender_user_id_fk_idx ON m4_engage.messages (sender_user_id);
CREATE INDEX contact_requests_requester_user_id_fk_idx ON m4_engage.contact_requests (requester_user_id);
CREATE INDEX contact_requests_owner_user_id_fk_idx ON m4_engage.contact_requests (owner_user_id);
CREATE INDEX contact_requests_consent_id_fk_idx ON m4_engage.contact_requests (consent_id);
CREATE INDEX appointments_conversation_id_fk_idx ON m4_engage.appointments (conversation_id);
CREATE INDEX appointments_listing_id_fk_idx ON m4_engage.appointments (listing_id);
CREATE INDEX reviews_reviewer_user_id_fk_idx ON m4_engage.reviews (reviewer_user_id);
CREATE INDEX blocks_blocked_user_id_fk_idx ON m4_engage.blocks (blocked_user_id);
CREATE INDEX carts_coupon_id_fk_idx ON m5_commerce.carts (coupon_id);
CREATE INDEX cart_items_package_code_fk_idx ON m5_commerce.cart_items (package_code);
CREATE INDEX cart_items_target_listing_id_fk_idx ON m5_commerce.cart_items (target_listing_id);
CREATE INDEX orders_coupon_id_fk_idx ON m5_commerce.orders (coupon_id);
CREATE INDEX order_items_package_code_fk_idx ON m5_commerce.order_items (package_code);
CREATE INDEX order_items_target_listing_id_fk_idx ON m5_commerce.order_items (target_listing_id);
CREATE INDEX refunds_requested_by_fk_idx ON m5_commerce.refunds (requested_by);
CREATE INDEX entitlements_order_item_id_fk_idx ON m5_commerce.entitlements (order_item_id);

COMMIT;
