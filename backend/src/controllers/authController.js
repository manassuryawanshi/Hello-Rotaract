import { supabase } from '../config/supabase.js';

export const login = async (req, res, next) => {
  try {
    const { emailOrRid, password } = req.body;
    let email = emailOrRid;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email/RotaractID and password are required' });
    }

    // If Rotaract ID is provided, look up the email
    if (!emailOrRid.includes('@')) {
      const { data: profileData, error: profileErr } = await supabase
        .from('hr_profiles')
        .select('email')
        .eq('rotaract_id', emailOrRid)
        .single();

      if (profileErr || !profileData) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      email = profileData.email;
    }

    // Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Fetch the full profile details
    const { data: profile, error: profileError } = await supabase
      .from('hr_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(500).json({ error: 'Profile not found' });
    }

    // Check approval status
    if (profile.status === 'PENDING_APPROVAL') {
      return res.status(403).json({ error: 'Awaiting Club Admin approval.' });
    }
    if (profile.status === 'REJECTED') {
      return res.status(403).json({ error: 'Your onboarding request was rejected.' });
    }

    // Respond with session and profile data
    res.status(200).json({
      session: authData.session, // Contains the JWT access_token
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: profile.role,
        status: profile.status,
      },
      profile
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, name, rotaractId, clubId, clubName, parentRotary, district, role } = req.body;

    if (!email || !password || !name || !rotaractId) {
      return res.status(400).json({ error: 'Missing required registration fields' });
    }

    // We pass extra metadata so the Postgres trigger can use it
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          rotaract_id: rotaractId,
          club_id: clubId,
          club_name: clubName,
          parent_rotary: parentRotary,
          district
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Assign the requested role
    if (role && ['MEMBER', 'TREASURER', 'ADMIN'].includes(role)) {
      await supabase.from('hr_profiles').update({ role }).eq('id', data.user.id);
    }

    res.status(201).json({
      message: 'Registration initiated successfully. Please check your approval status.',
      user: data.user
    });
  } catch (err) {
    next(err);
  }
};

export const getPendingApprovals = async (req, res, next) => {
  try {
    const { data: pendingUsers, error } = await supabase
      .from('hr_profiles')
      .select('*, auth_users:id(email)')
      .eq('status', 'PENDING_APPROVAL');

    if (error) throw error;
    
    // Map to expected { user, profile } format
    const approvals = pendingUsers.map(p => ({
      user: { id: p.id, email: p.email, role: p.role, status: p.status },
      profile: p
    }));
    
    res.status(200).json({ pendingApprovals: approvals });
  } catch (err) {
    next(err);
  }
};

export const approveMember = async (req, res, next) => {
  try {
    const { userId, action } = req.body;
    if (!userId || !action) return res.status(400).json({ error: 'Missing userId or action' });
    
    const { data: profile, error } = await supabase
      .from('hr_profiles')
      .update({ status: action })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;

    if (action === 'APPROVED') {
      await supabase.from('hr_notifications').insert({
        profile_id: userId,
        title: 'Account Approved',
        content: 'Congratulations, the club administrator approved your onboarding request.'
      });
    }

    res.status(200).json({ message: `User ${action}`, profile });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone, avatarUrl } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (avatarUrl) updates.avatar_url = avatarUrl;
    
    const { data: profile, error } = await supabase
      .from('hr_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    res.status(200).json({ message: 'Profile updated', profile });
  } catch (err) {
    next(err);
  }
};
