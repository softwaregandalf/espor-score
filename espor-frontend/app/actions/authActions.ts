import { supabase } from "@/app/utils/supabaseClient"; // Supabase client dosyanın yolu.

// KAYIT OL (SIGN UP)
export async function signUpWithEmail(email: string, password: string, nickname: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname, // Kullanıcının topluluktaki ismi Supabase MetaData'sına kaydedilir
          avatar_url: nickname.slice(0, 2).toUpperCase(),
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err.message || "Bilinmeyen bir hata oluştu." };
  }
}

// GİRİŞ YAP (SIGN IN) - AuthModal içerisindeki Login sekmesi için
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    return { success: false, message: err.message || "Bilinmeyen bir hata oluştu." };
  }
}