import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Este arquivo será usado para configuração do Supabase futuramente.
// Siga a documentação oficial: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
