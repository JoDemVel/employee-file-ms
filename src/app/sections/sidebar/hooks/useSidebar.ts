import { useEffect, useState } from 'react';
import { useSidebarService } from './useSidebarService';
import type { Company } from '@/app/shared/interfaces/Company';

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
