import { useConfigStore } from '@/app/shared/stores/useConfigStore';
import { useSidebar } from '@/components/ui/sidebar';
import type { CompanyResponse } from '@/rest-client/interface/response/CompanyResponse';
import { useEffect, useState } from 'react';

export const useCompanySwitcher = (companies: CompanyResponse[]) => {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState(companies[0]);

  const { companyId, setCompanyId } = useConfigStore();

  useEffect(() => {
    if (companies.length > 0) {
      if (!companyId) {
        setCompanyId(companies[0].id);
        setActiveTeam(companies[0]);
        return;
      }
      const company =
        companies.find((team) => team.id === companyId) || companies[0];
      setActiveTeam(company);
      localStorage.setItem('company_id', company.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, companies]);

  return {
    activeTeam,
    setActiveTeam,
    isMobile,
    setCompanyId,
  };
};
