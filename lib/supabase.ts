// Point d'entrée unique — réexporte les deux clients
// Server Components : import { createServerClient } from '@/lib/supabase'
// Client Components : import { supabase } from '@/lib/supabase'
export { createServerClient } from './supabase/server'
export { supabase } from './supabase/client'
export type { Database, Tables, TablesInsert, TablesUpdate } from './supabase/types'
