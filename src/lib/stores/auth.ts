import { writable } from 'svelte/store';

interface AuthState {
  token: string | null;
  user: any | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    token: localStorage.getItem('token'),
    user: null
  });

  return {
    subscribe,
    login: (token: string) => {
      localStorage.setItem('token', token);
      update(state => ({ ...state, token }));
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ token: null, user: null });
    },
    setUser: (user: any) => {
      update(state => ({ ...state, user }));
    }
  };
}

export const auth = createAuthStore();