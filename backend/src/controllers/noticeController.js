import { supabase } from '../config/supabase.js';

export const getNotices = async (req, res, next) => {
  try {
    const { data: notices, error } = await supabase
      .from('hr_notices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ notices });
  } catch (err) {
    next(err);
  }
};

export const createNotice = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data: notice, error } = await supabase
      .from('hr_notices')
      .insert({
        title,
        content,
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Send notifications to all users
    const { data: profiles } = await supabase.from('hr_profiles').select('id');
    if (profiles && profiles.length > 0) {
      const notificationsPayload = profiles
        .filter(p => p.id !== req.user.id)
        .map(p => ({
          profile_id: p.id,
          title: `New Notice: ${title}`,
          content: content.substring(0, 100) + '...'
        }));
      
      if (notificationsPayload.length > 0) {
        await supabase.from('hr_notifications').insert(notificationsPayload);
      }
    }

    res.status(201).json({ message: 'Notice sent', notice });
  } catch (err) {
    next(err);
  }
};
