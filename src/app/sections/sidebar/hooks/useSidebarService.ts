import { getMockCompanies } from '@/app/shared/data/mockCompanies';

export const useSidebarService = () => {
  const getCompanies = getMockCompanies();
  return { getCompanies };
};
