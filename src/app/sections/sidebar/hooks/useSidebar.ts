import { useEffect, useState } from 'react';
import { useSidebarService } from './useSidebarService';
import type { CompanyResponse } from '@/rest-client/interface/response/CompanyResponse';

export const useSidebar = () => {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const { getCompanies } = useSidebarService();

  useEffect(() => {
    getCompanies
      .then((data: CompanyResponse[]) => {
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
