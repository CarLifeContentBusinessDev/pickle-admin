import { create } from 'zustand';

interface LoginTokenState {
  loginToken: string;
  setLoginToken: (token: string) => void;
  clearLoginToken: () => void;
}

export const useLoginTokenStore = create<LoginTokenState>((set) => ({
  loginToken: localStorage.getItem('loginToken') || '',
  setLoginToken: (token: string) => {
    localStorage.setItem('loginToken', token);
    set({ loginToken: token });
  },
  clearLoginToken: () => {
    localStorage.removeItem('loginToken');
    set({ loginToken: '' });
  },
}));
