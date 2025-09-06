import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ConfigState = {
  companyId: string | null;
  setCompanyId: (id: string) => void;
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      companyId: null,
      setCompanyId: (id: string) => set({ companyId: id }),
    }),
    {
      name: 'config-store',
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
