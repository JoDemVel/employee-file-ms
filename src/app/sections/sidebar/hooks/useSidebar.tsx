import type { Company } from '@/app/shared/data/companies';
import { useEffect, useState } from 'react';
import { useSidebarService } from './useSidebarService';

export const useSidebar = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { getCompanies } = useSidebarService();

  useEffect(() => {
    getCompanies()
      .then((data) => {
        setCompanies(data as Company[]);
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
      });
  }, []);

  return {
    companies,
    setCompanies,
  };
};
