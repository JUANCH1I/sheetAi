import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jyusodwipwivjxkwglox.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dXNvZHdpcHdpdmp4a3dnbG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwODg0NjIsImV4cCI6MjA1NTY2NDQ2Mn0.KU7FZtP4dRPtV-qDns8WtlPMoxn3eg9qpzWP5SELohI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
