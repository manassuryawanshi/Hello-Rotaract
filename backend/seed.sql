-- Hello Rotaract Database Seed Script
-- WARNING: This script inserts dummy data into the live database.
-- It requires the pgcrypto extension to hash passwords.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create Dummy Users in auth.users
-- This will automatically trigger 'handle_new_user' to create hr_profiles.
-- Password for all is: password123
INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, confirmation_token, email_change, email_change_token_new, recovery_token)
VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'admin@test.org', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Alice Admin","rotaract_id":"RID-ADMIN"}', now(), now(), 'authenticated', '', '', '', ''),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'treasurer@test.org', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Bob Treasurer","rotaract_id":"RID-TREAS"}', now(), now(), 'authenticated', '', '', '', ''),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', 'member1@test.org', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Charlie Member","rotaract_id":"RID-MEMB1"}', now(), now(), 'authenticated', '', '', '', ''),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'member2@test.org', crypt('password123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Diana Member","rotaract_id":"RID-MEMB2"}', now(), now(), 'authenticated', '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- 2. Update roles and status for the dummy profiles
UPDATE public.hr_profiles SET role = 'ADMIN', status = 'APPROVED' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE public.hr_profiles SET role = 'TREASURER', status = 'APPROVED' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE public.hr_profiles SET role = 'MEMBER', status = 'APPROVED' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE public.hr_profiles SET role = 'MEMBER', status = 'PENDING_APPROVAL' WHERE id = '44444444-4444-4444-4444-444444444444';

-- 3. Create Events
INSERT INTO public.hr_events (id, title, description, start_time, end_time, venue, tag, created_by)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Annual Beach Cleanup', 'Join us to clean up Juhu beach.', now() - interval '2 days', now() - interval '1 day', 'Juhu Beach', 'COMMUNITY', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Rotaract GBM 1', 'First General Body Meeting of the year.', now() + interval '3 days', now() + interval '3 days' + interval '2 hours', 'Club House', 'MEETING', '11111111-1111-1111-1111-111111111111'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Fundraiser Gala', 'Dinner and auction to raise funds.', now() + interval '10 days', now() + interval '10 days' + interval '5 hours', 'Grand Hotel', 'FUNDRAISER', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- 4. Create Tasks
INSERT INTO public.hr_tasks (id, title, description, assigned_to, created_by, status, end_date)
VALUES
(uuid_generate_v4(), 'Order T-Shirts', 'Order club t-shirts for the new members.', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'PENDING', now() + interval '5 days'),
(uuid_generate_v4(), 'Prepare GBM Slides', 'Create presentation for GBM 1.', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'IN_PROGRESS', now() + interval '2 days'),
(uuid_generate_v4(), 'Pay Annual Dues', 'Submit your annual membership fees.', '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'COMPLETED', now() - interval '1 day')
ON CONFLICT DO NOTHING;

-- 5. Add Attendance (for the past event)
INSERT INTO public.hr_attendance (event_id, profile_id, attended_by_admin_id)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- 6. Add Payment Records
INSERT INTO public.hr_payments (profile_id, amount_due, status, upi_transaction_ref)
VALUES
('33333333-3333-3333-3333-333333333333', 1500, 'PENDING_VERIFICATION', 'UPI1234567890'),
('44444444-4444-4444-4444-444444444444', 1500, 'UNPAID', NULL)
ON CONFLICT DO NOTHING;
