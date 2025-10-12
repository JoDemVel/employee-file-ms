import type { Company } from '../interfaces/company';
import { companies } from './companies';
import ShortUniqueId from 'short-unique-id';

export async function getMockCompanies(): Promise<Company[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(companies);
    }, 250);
  });
}

export async function addCompany(
  company: Omit<Company, 'id'>
): Promise<Company> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { randomUUID } = new ShortUniqueId({ length: 10 });

      const newCompany = { ...company, id: randomUUID() };
      companies.push(newCompany);
      resolve(newCompany);
    }, 250);
  });
}
