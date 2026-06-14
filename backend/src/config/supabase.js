import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// We use the Service Role Key so the backend has full admin access to bypass RLS policies
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  realtime: {
    transport: WebSocket
  }
});
