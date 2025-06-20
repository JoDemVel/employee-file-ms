import type { Company } from '@/app/shared/data/companies';
import { useSidebar } from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

export const useCompanySwitcher = (companies: Company[]) => {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState(companies[0]);

  useEffect(() => {
    if (companies.length > 0) {
      setActiveTeam(companies[0]);
    }
  }, [companies]);

  return {
    activeTeam,
    setActiveTeam,
    isMobile,
  };
};
