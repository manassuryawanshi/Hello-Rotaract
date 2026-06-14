import { supabase } from './src/config/supabase.js';

const initialUsers = [
  {
    email: 'admin@rotaract.org',
    password: 'password123',
    name: 'Aarav Mehta',
    rotaract_id: 'RID-9901',
    club_id: 'CID-505',
    club_name: 'Rotaract Club of Midtown',
    parent_rotary: 'Rotary Club of Midtown Metro',
    district: 'RID 3141',
    role: 'ADMIN',
    status: 'APPROVED'
  },
  {
    email: 'treasurer@rotaract.org',
    password: 'password123',
    name: 'Siddharth Sen',
    rotaract_id: 'RID-8802',
    club_id: 'CID-505',
    club_name: 'Rotaract Club of Midtown',
    parent_rotary: 'Rotary Club of Midtown Metro',
    district: 'RID 3141',
    role: 'TREASURER',
    status: 'APPROVED'
  },
  {
    email: 'member@rotaract.org',
    password: 'password123',
    name: 'Riya Sharma',
    rotaract_id: 'RID-7703',
    club_id: 'CID-505',
    club_name: 'Rotaract Club of Midtown',
    parent_rotary: 'Rotary Club of Midtown Metro',
    district: 'RID 3141',
    role: 'MEMBER',
    status: 'APPROVED'
  }
];

const seedData = async () => {
  console.log('Starting seed process...');

  for (const user of initialUsers) {
    console.log(`Processing user: ${user.email}`);

    let userId = null;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        rotaract_id: user.rotaract_id,
        club_id: user.club_id,
        club_name: user.club_name,
        parent_rotary: user.parent_rotary,
        district: user.district
      }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`- ${user.email} already exists in auth.`);
        // Fetch existing user to get ID
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (users) {
          const existingUser = users.find(u => u.email === user.email);
          if (existingUser) userId = existingUser.id;
        }
      } else {
        console.error(`- Error creating auth for ${user.email}:`, authError.message);
        continue;
      }
    } else {
      userId = authData.user.id;
      console.log(`- Auth created for ${user.email} (ID: ${userId})`);
    }

    if (userId) {
      // Upsert profile in hr_profiles
      const { error: profileError } = await supabase.from('hr_profiles').upsert({
        id: userId,
        name: user.name,
        rotaract_id: user.rotaract_id,
        club_id: user.club_id,
        club_name: user.club_name,
        parent_rotary: user.parent_rotary,
        district: user.district,
        role: user.role,
        status: user.status
      });

      if (profileError) {
        console.error(`- Error updating profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`- Profile created/updated for ${user.email}`);
      }
    }
  }

  console.log('Seed process finished!');
};

seedData();
