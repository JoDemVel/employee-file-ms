import { useEffect, useState } from 'react';
import { useSidebarService } from './useSidebarService';
import type { Company } from '@/rest-client/interface/Company';

export const useSidebar = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const { getCompanies } = useSidebarService();

  useEffect(() => {
    getCompanies
      .then((data: Company[]) => {
        console.log('Fetched companies:', data);
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
