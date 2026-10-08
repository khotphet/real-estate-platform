-- behavioural tests for the MapNest schema; each "expect fail" runs in its own savepoint
\set ON_ERROR_STOP 0
SELECT count(*) AS tables FROM information_schema.tables WHERE table_schema IN ('m1_identity','m2_listing','m3_discovery','m4_engage','m5_commerce','core');
SELECT count(*) AS fks FROM information_schema.table_constraints WHERE constraint_type='FOREIGN KEY' AND table_schema IN ('m1_identity','m2_listing','m3_discovery','m4_engage','m5_commerce','core');
SELECT count(*) AS rls_off FROM pg_tables WHERE schemaname IN ('m1_identity','m2_listing','m3_discovery','m4_engage','m5_commerce','core') AND NOT rowsecurity;

BEGIN;
INSERT INTO core.admin_areas(code, level, name_th) VALUES ('41','province','อุดรธานี');
INSERT INTO core.admin_areas(code, level, parent_code, name_th) VALUES ('4101','district','41','เมืองอุดรธานี');
INSERT INTO m1_identity.users(id, display_name, email, phone_e164) VALUES
 ('00000000-0000-0000-0000-000000000001','Owner','Owner@Mail.com','+66812345678'),
 ('00000000-0000-0000-0000-000000000002','Buyer','buyer@mail.com',NULL);
INSERT INTO m2_listing.property_types(code, name_th) VALUES ('condo','คอนโด');
INSERT INTO m2_listing.listings(id, public_code, poster_user_id, poster_role, deal_type, property_type_code)
 VALUES ('10000000-0000-0000-0000-000000000001','UD-000001','00000000-0000-0000-0000-000000000001','owner','sale','condo');
SAVEPOINT s;

\echo '--- T1 citext unique email (expect FAIL duplicate)'
INSERT INTO m1_identity.users(display_name, email) VALUES ('dup','owner@mail.com');
ROLLBACK TO s;
\echo '--- T2 bad phone format (expect FAIL check)'
INSERT INTO m1_identity.users(display_name, phone_e164) VALUES ('x','0812345678');
ROLLBACK TO s;
\echo '--- T3 publish draft without price/location (expect FAIL published_complete)'
UPDATE m2_listing.listings SET status='active' WHERE public_code='UD-000001';
ROLLBACK TO s;
\echo '--- T4 publish complete listing (expect OK)'
UPDATE m2_listing.listings SET status='active', title='คอนโดใกล้ มรภ.', price_thb=1500000,
  location=ST_GeogFromText('POINT(102.787 17.415)'), display_location=ST_GeogFromText('POINT(102.789 17.416)')
  WHERE public_code='UD-000001';
SAVEPOINT s2;
\echo '--- T5 reserved without reserved_until (expect FAIL)'
UPDATE m2_listing.listings SET status='reserved' WHERE public_code='UD-000001';
ROLLBACK TO s2;
\echo '--- T6 agent_hub without hub_mode (expect FAIL)'
UPDATE m2_listing.listings SET sale_channel='agent_hub' WHERE public_code='UD-000001';
ROLLBACK TO s2;
\echo '--- T7 updated_at trigger (expect updated_at > created_at)'
SELECT pg_sleep(0.05);
UPDATE m2_listing.listings SET title='คอนโดใหม่' WHERE public_code='UD-000001';
SELECT updated_at > created_at AS trigger_ok FROM m2_listing.listings WHERE public_code='UD-000001';
\echo '--- T8 two cover photos (expect FAIL one_cover)'
INSERT INTO m2_listing.listing_photos(listing_id, original_key, is_cover) VALUES ('10000000-0000-0000-0000-000000000001','a',true);
INSERT INTO m2_listing.listing_photos(listing_id, original_key, is_cover) VALUES ('10000000-0000-0000-0000-000000000001','b',true);
ROLLBACK TO s2;
\echo '--- T9 overlapping appointments for same host (2nd expect FAIL exclusion)'
INSERT INTO m4_engage.appointments(listing_id, host_user_id, guest_user_id, starts_at, ends_at, status) VALUES
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','2026-10-10 10:00+07','2026-10-10 11:00+07','confirmed');
SAVEPOINT s3;
INSERT INTO m4_engage.appointments(listing_id, host_user_id, guest_user_id, starts_at, ends_at) VALUES
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','2026-10-10 10:30+07','2026-10-10 11:30+07');
ROLLBACK TO s3;
\echo '--- T10 cancelled slot does not block (expect OK)'
INSERT INTO m4_engage.appointments(listing_id, host_user_id, guest_user_id, starts_at, ends_at, status) VALUES
 ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','2026-10-10 10:30+07','2026-10-10 11:30+07','cancelled');
\echo '--- T11 radius out of range (expect FAIL)'
SAVEPOINT s4;
INSERT INTO m4_engage.criteria(user_id, deal_type, center, display_center, radius_m) VALUES
 ('00000000-0000-0000-0000-000000000002','sale',ST_GeogFromText('POINT(102.78 17.41)'),ST_GeogFromText('POINT(102.78 17.41)'),20000);
ROLLBACK TO s4;
\echo '--- T12 order total formula wrong (expect FAIL)'
INSERT INTO m5_commerce.orders(order_no, user_id, subtotal_satang, discount_satang, vat_satang, total_satang)
 VALUES ('MN-1','00000000-0000-0000-0000-000000000002',10000,0,700,10000);
ROLLBACK TO s4;
\echo '--- T13 order total formula right (expect OK) + duplicate webhook (expect FAIL)'
INSERT INTO m5_commerce.orders(order_no, user_id, subtotal_satang, discount_satang, vat_satang, total_satang)
 VALUES ('MN-2','00000000-0000-0000-0000-000000000002',10000,1000,630,9630);
INSERT INTO m5_commerce.payment_events(provider_event_id, event_type, signature_ok, payload) VALUES ('evt_1','charge.complete',true,'{}');
SAVEPOINT s5;
INSERT INTO m5_commerce.payment_events(provider_event_id, event_type, signature_ok, payload) VALUES ('evt_1','charge.complete',true,'{}');
ROLLBACK TO s5;
\echo '--- T14 second pending KYC (expect FAIL)'
INSERT INTO m1_identity.kyc_submissions(user_id, id_card_key, selfie_key) VALUES ('00000000-0000-0000-0000-000000000001','k1','s1');
SAVEPOINT s6;
INSERT INTO m1_identity.kyc_submissions(user_id, id_card_key, selfie_key) VALUES ('00000000-0000-0000-0000-000000000001','k2','s2');
ROLLBACK TO s6;
\echo '--- T15 two accepted exclusive hub mandates (2nd expect FAIL)'
INSERT INTO m4_engage.hub_requests(listing_id, agent_user_id, mode, status) VALUES ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000002','exclusive','accepted');
SAVEPOINT s7;
INSERT INTO m1_identity.users(id, display_name) VALUES ('00000000-0000-0000-0000-000000000003','Agent2');
INSERT INTO m4_engage.hub_requests(listing_id, agent_user_id, mode, status) VALUES ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000003','exclusive','accepted');
ROLLBACK TO s7;
\echo '--- T16 search index bbox + radius query uses geography (expect 1 row, 1 row)'
INSERT INTO m3_discovery.listing_index(listing_id, public_code, status, deal_type, property_type_code, price_thb, display_location, title, poster_role, sale_channel, published_at)
 SELECT id, public_code, 'active', deal_type, property_type_code, price_thb, display_location, title, poster_role, sale_channel, now() FROM m2_listing.listings;
SELECT count(*) AS in_bbox FROM m3_discovery.listing_index WHERE display_location && ST_MakeEnvelope(102.7,17.3,102.9,17.5,4326)::geography;
SELECT count(*) AS within_2km FROM m3_discovery.listing_index WHERE ST_DWithin(display_location, ST_GeogFromText('POINT(102.78 17.41)'), 2000);
\echo '--- T17 FK: listing with unknown property type (expect FAIL)'
SAVEPOINT s8;
INSERT INTO m2_listing.listings(public_code, poster_user_id, poster_role, deal_type, property_type_code) VALUES ('UD-9','00000000-0000-0000-0000-000000000001','owner','sale','castle');
ROLLBACK TO s8;
ROLLBACK;
