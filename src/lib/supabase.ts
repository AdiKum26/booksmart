import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvjmvnlgdkzhmuyrhvuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12am12bmxnZGt6aG11eXJodnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMTI1MDcsImV4cCI6MjA4Nzg4ODUwN30.poMzYeyFUm5Tzq2i1SuBCGRARSZzfddcHZxitsIyk98';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
