import { Command, GalleryVerticalEnd } from 'lucide-react';
import type { Company } from '@/app/shared/interfaces/company';

export const companies: Company[] = [
  {
    id: 'comp-0',
    name: 'TECHOBOL',
    companyType: 'S.R.L.',
    logo: GalleryVerticalEnd,
  },
  {
    id: 'comp-1',
    name: 'Megadis',
    companyType: 'S.A.',
    logo: Command,
  },
];
