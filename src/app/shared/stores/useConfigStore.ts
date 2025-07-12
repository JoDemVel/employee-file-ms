import { create } from 'zustand';

type ConfigState = {
  companyId: string | null;
  setCompanyId: (id: string) => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  companyId: null,
  setCompanyId: (id: string) => set({ companyId: id }),
}));
