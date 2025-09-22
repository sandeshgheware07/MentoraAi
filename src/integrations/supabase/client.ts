import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qihljziaxfuhfwaqcidc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpaGxqemlheGZ1aGZ3YXFjaWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNjYzNDMsImV4cCI6MjA3Mzk0MjM0M30.VY_OvBn6p_UfJ_jLXVXCA8aM82tPmH9no-ixB4bPZzU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});