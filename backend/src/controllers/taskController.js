import { supabase } from '../config/supabase.js';

export const getTasks = async (req, res, next) => {
  try {
    let query = supabase
      .from('hr_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    // Admins see all tasks, members see their own
    if (req.profile.role !== 'ADMIN') {
      query = query.or(`created_by.eq.${req.user.id},assigned_to.eq.${req.user.id},assigned_to.is.null`);
    }

    const { data: tasks, error } = await query;

    if (error) throw error;
    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, startDate, endDate } = req.body;

    if (!title || !endDate) {
      return res.status(400).json({ error: 'Title and End Date are required' });
    }

    const { data: newTask, error } = await supabase
      .from('hr_tasks')
      .insert({
        title,
        description,
        assigned_to: assignedTo || null,
        created_by: req.user.id,
        start_date: startDate || new Date().toISOString(),
        end_date: endDate
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Task created', task: newTask });
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const { data: task, error: fetchErr } = await supabase
      .from('hr_tasks')
      .select('*')
      .eq('id', taskId)
      .single();
      
    if (fetchErr || !task) return res.status(404).json({ error: 'Task not found' });
    
    if (task.created_by !== req.user.id && task.assigned_to !== req.user.id && req.profile.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const { data: updatedTask, error } = await supabase
      .from('hr_tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ message: 'Task status updated', task: updatedTask });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const { data: task, error: fetchErr } = await supabase
      .from('hr_tasks')
      .select('*')
      .eq('id', taskId)
      .single();
      
    if (fetchErr || !task) return res.status(404).json({ error: 'Task not found' });
    
    if (task.created_by !== req.user.id && req.profile.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only the creator or an admin can delete this task' });
    }

    const { error } = await supabase.from('hr_tasks').delete().eq('id', taskId);

    if (error) throw error;
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};
