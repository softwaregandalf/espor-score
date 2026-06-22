import { createClient } from '@supabase/supabase-js';

// Ortam değişkenlerinden (env) Supabase bağlantı bilgilerini alıyoruz
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// SİSTEMİN KALBİ: supabase objesini tüm projeye "export" ediyoruz
export const supabase = createClient(supabaseUrl, supabaseAnonKey);