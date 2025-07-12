import { useEffect, useState } from 'react';
import { useSidebarService } from './useSidebarService';
import type { Company } from '@/app/shared/interfaces/company';

export const useSidebar = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { getCompanies } = useSidebarService();

  useEffect(() => {
    getCompanies
      .then((data: Company[]) => {
        setCompanies(data);
      })
      .catch((error) => {
        console.error('Error fetching companies:', error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    companies,
    setCompanies,
  };
};
