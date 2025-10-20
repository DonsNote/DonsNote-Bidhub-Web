import { supabase } from '@/lib/supabase/client';

export const authApi = {
  // 이메일/비밀번호 로그인
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // 이메일/비밀번호 회원가입
  async signUpWithEmail(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },

  // 현재 사용자 가져오기
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return user;
  },

  // 세션 가져오기
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return session;
  },

  // 인증 상태 변경 구독
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
