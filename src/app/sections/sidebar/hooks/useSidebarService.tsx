import { companies } from '@/app/shared/data/companies';

export const useSidebarService = () => {
  const getCompanies = async () => {
    return new Promise((resolve) => {
      resolve(companies);
    });
  };

  return { getCompanies };
};
