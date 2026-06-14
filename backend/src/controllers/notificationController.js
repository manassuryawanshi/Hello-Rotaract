import { supabase } from '../config/supabase.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const { data: notifications, error } = await supabase
      .from('hr_notifications')
      .select('*')
      .eq('profile_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('hr_notifications')
      .update({ read: true })
      .eq('profile_id', req.user.id)
      .eq('read', false);

    if (error) throw error;
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (err) {
    next(err);
  }
};
