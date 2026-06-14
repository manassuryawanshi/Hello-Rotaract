import { supabase } from '../config/supabase.js';

export const getAllEvents = async (req, res, next) => {
  try {
    const { data: events, error } = await supabase
      .from('hr_events')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;
    res.status(200).json({ events });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, startTime, endTime, venue, tag, googleRulebookUrl, meetLink, coordinators } = req.body;

    if (!title || !startTime || !endTime || !venue) {
      return res.status(400).json({ error: 'Title, Start Time, End Time, and Venue are required' });
    }

    const { data: newEvent, error } = await supabase
      .from('hr_events')
      .insert({
        title,
        description,
        start_time: startTime,
        end_time: endTime,
        venue,
        tag,
        google_rulebook_url: googleRulebookUrl,
        meet_link: meetLink,
        coordinators: coordinators || [req.user.id],
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (err) {
    next(err);
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }

    const { data: attendance, error } = await supabase
      .from('hr_attendance')
      .insert({
        event_id: eventId,
        profile_id: profileId,
        attended_by_admin_id: req.user.id
      })
      .select()
      .single();

    if (error) {
      // Postgres unique constraint violation
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Attendance already marked for this user.' });
      }
      throw error;
    }

    // Send notification
    const { data: ev } = await supabase.from('hr_events').select('title').eq('id', eventId).single();
    await supabase.from('hr_notifications').insert({
      profile_id: profileId,
      title: 'Attendance Confirmed',
      content: `Your attendance at "${ev?.title || 'Event'}" has been successfully logged by admin.`
    });

    res.status(200).json({ message: 'Attendance marked', attendance });
  } catch (err) {
    next(err);
  }
};

export const removeAttendance = async (req, res, next) => {
  try {
    const { eventId, profileId } = req.params;

    const { error } = await supabase
      .from('hr_attendance')
      .delete()
      .match({ event_id: eventId, profile_id: profileId });

    if (error) throw error;
    res.status(200).json({ message: 'Attendance removed successfully' });
  } catch (err) {
    next(err);
  }
};

export const getEventAttendance = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const { data: attendance, error } = await supabase
      .from('hr_attendance')
      .select('*, hr_profiles(name, rotaract_id, avatar_url)')
      .eq('event_id', eventId);

    if (error) throw error;
    res.status(200).json({ attendance });
  } catch (err) {
    next(err);
  }
};
