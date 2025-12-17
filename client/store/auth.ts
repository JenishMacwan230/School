import { create } from 'zustand';
import { apiFetch } from '@/lib/api';

type User = {
  id: string;
  role: "SUPER_ADMIN" | "USER";
};

type AuthState = {
  user: User | null;
  loading: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isLoginOpen: false,

  openLogin: () => set({ isLoginOpen: true }),
  closeLogin: () => set({ isLoginOpen: false }),

  fetchUser: async () => {
    try {
      const data = await apiFetch("/api/auth/me");
      set({ user: data.user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    set({ user: null });
  },

}));
