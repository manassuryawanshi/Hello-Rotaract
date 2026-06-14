import { supabase } from '../config/supabase.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !authData.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = authData.user;
    
    // Fetch profile to attach role
    const { data: profile, error: profileErr } = await supabase
      .from('hr_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
      
    if (profile && !profileErr) {
      req.profile = profile;
    } else {
      return res.status(401).json({ error: 'User profile not found' });
    }
    
    next();
  } catch (err) {
    next(err);
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.profile || !roles.includes(req.profile.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
