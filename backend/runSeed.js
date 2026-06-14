import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

import WebSocket from 'ws';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket }
});

async function runSeed() {
  console.log('Starting database clear and seed...');

  try {
    // 1. DELETE ALL DATA
    // hr_payments, hr_attendance, hr_tasks, hr_notices, hr_events, hr_profiles
    // Note: Since auth.users is tied to hr_profiles via trigger, deleting auth.users cascades if configured,
    // but the easiest way is to use the Supabase Admin API to delete all users.
    console.log('Fetching existing users...');
    const { data: users, error: fetchUserErr } = await supabase.auth.admin.listUsers();
    if (fetchUserErr) throw fetchUserErr;

    console.log(`Found ${users.users.length} users. Deleting...`);
    for (const user of users.users) {
      await supabase.auth.admin.deleteUser(user.id);
    }
    console.log('Deleted all users (and cascaded profiles/data).');

    // 2. CREATE NEW USERS
    console.log('Creating dummy users...');
    const dummyUsers = [
      { email: 'admin@rotaract.org', password: 'password123', name: 'Alice Admin', role: 'ADMIN', rotaract_id: 'RID-ADMIN', id: '11111111-1111-1111-1111-111111111111' },
      { email: 'treasurer@rotaract.org', password: 'password123', name: 'Bob Treasurer', role: 'TREASURER', rotaract_id: 'RID-TREAS', id: '22222222-2222-2222-2222-222222222222' },
      { email: 'member1@rotaract.org', password: 'password123', name: 'Charlie Member', role: 'MEMBER', rotaract_id: 'RID-MEMB1', id: '33333333-3333-3333-3333-333333333333' },
      { email: 'member2@rotaract.org', password: 'password123', name: 'Diana Member', role: 'MEMBER', rotaract_id: 'RID-MEMB2', id: '44444444-4444-4444-4444-444444444444' },
      { email: 'member@rotaract.org', password: 'member123', name: 'Generic Member', role: 'MEMBER', rotaract_id: 'RID-7703', id: '55555555-5555-5555-5555-555555555555' } // Auto-approval match
    ];

    const createdProfiles = [];
    for (const u of dummyUsers) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: {
          name: u.name,
          rotaract_id: u.rotaract_id,
          club_id: 'CID-505',
          club_name: 'Rotaract Club of Midtown',
          parent_rotary: 'Rotary Club of Midtown Metro',
          district: 'RID 3141'
        }
      });
      if (error) {
        console.error(`Error creating ${u.email}:`, error.message);
      } else {
        console.log(`Created ${u.email}`);
        createdProfiles.push({ id: data.user.id, role: u.role, status: u.role === 'ADMIN' || u.role === 'TREASURER' ? 'APPROVED' : 'PENDING_APPROVAL' });
      }
    }

    // 3. UPDATE ROLES AND STATUS
    console.log('Updating profile roles and approval statuses...');
    for (const p of createdProfiles) {
      // We'll approve member@rotaract.org by default for easier testing
      const status = p.role === 'ADMIN' || p.role === 'TREASURER' ? 'APPROVED' : 'PENDING_APPROVAL';
      await supabase.from('hr_profiles').update({ role: p.role, status: status }).eq('id', p.id);
    }
    
    // Explicitly approve Generic Member
    await supabase.from('hr_profiles').update({ status: 'APPROVED' }).eq('rotaract_id', 'RID-7703');

    // Fetch IDs
    const { data: adminData } = await supabase.from('hr_profiles').select('id').eq('role', 'ADMIN').single();
    const { data: treasData } = await supabase.from('hr_profiles').select('id').eq('role', 'TREASURER').single();
    const { data: memData } = await supabase.from('hr_profiles').select('id').eq('role', 'MEMBER').limit(1).single();

    const adminId = adminData.id;
    const treasId = treasData.id;
    const memId = memData?.id || adminId;

    // 4. CREATE EVENTS
    console.log('Creating events...');
    const now = new Date();
    const pastStart = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const pastEnd = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString();
    
    const futureStart = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const futureEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString();

    const { data: events, error: eventErr } = await supabase.from('hr_events').insert([
      { title: 'Annual Beach Cleanup', description: 'Join us to clean up Juhu beach.', start_time: pastStart, end_time: pastEnd, venue: 'Juhu Beach', tag: 'COMMUNITY', created_by: adminId },
      { title: 'Rotaract GBM 1', description: 'First General Body Meeting.', start_time: futureStart, end_time: futureEnd, venue: 'Club House', tag: 'MEETING', created_by: adminId },
      { title: 'Fundraiser Gala', description: 'Dinner to raise funds.', start_time: futureStart, end_time: futureEnd, venue: 'Grand Hotel', tag: 'FUNDRAISER', created_by: treasId }
    ]).select();

    if (eventErr) console.error('Error creating events:', eventErr);

    // 5. CREATE TASKS
    console.log('Creating tasks...');
    await supabase.from('hr_tasks').insert([
      { title: 'Order T-Shirts', description: 'Order club t-shirts for new members.', assigned_to: treasId, created_by: adminId, status: 'PENDING', end_date: futureStart },
      { title: 'Prepare GBM Slides', description: 'Create presentation for GBM 1.', assigned_to: memId, created_by: adminId, status: 'IN_PROGRESS', end_date: futureStart },
      { title: 'Pay Annual Dues', description: 'Submit your annual membership fees.', assigned_to: memId, created_by: treasId, status: 'COMPLETED', end_date: pastEnd }
    ]);

    // 6. CREATE ATTENDANCE
    console.log('Adding attendance...');
    if (events && events.length > 0) {
      await supabase.from('hr_attendance').insert([
        { event_id: events[0].id, profile_id: adminId, attended_by_admin_id: adminId },
        { event_id: events[0].id, profile_id: memId, attended_by_admin_id: adminId }
      ]);
    }

    // 7. CREATE PAYMENTS
    console.log('Adding payment dues...');
    await supabase.from('hr_payments').insert([
      { profile_id: memId, amount_due: 1500, status: 'PENDING_VERIFICATION', upi_transaction_ref: 'UPI1234567890' },
      { profile_id: adminId, amount_due: 1500, status: 'UNPAID' }
    ]);

    console.log('SUCCESS: Database successfully seeded with rich testing data!');

  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

runSeed();
