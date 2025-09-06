import { useConfigStore } from '@/app/shared/stores/useConfigStore';
import { useSidebar } from '@/components/ui/sidebar';
import type { Company } from '@/rest-client/interface/Company';
import { useEffect, useState } from 'react';

export const useCompanySwitcher = (companies: Company[]) => {
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
      setActiveTeam(
        companies.find((team) => team.id === companyId) || companies[0]
      );
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
