import { create } from 'zustand';
import { User, RegistroData } from '../types';
import * as userApi from '../api/userApi';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  registro: (datos: RegistroData) => Promise<void>;
  logout: () => void;
  actualizarPerfil: (datos: Partial<Omit<User, 'id' | 'email' | 'fechaCreacion'>>) => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,

  login: async (email: string, password: string) => {
    const user = await userApi.login(email, password);
    set({ user, isLoggedIn: true });
  },

  registro: async (datos: RegistroData) => {
    const user = await userApi.registro(datos);
    set({ user, isLoggedIn: true });
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
  },

  actualizarPerfil: async (datos) => {
    const { user } = get();
    if (!user) return;
    const updatedUser = await userApi.actualizarPerfil(user.id, datos);
    set({ user: updatedUser });
  },
}));

export default useAuthStore;
