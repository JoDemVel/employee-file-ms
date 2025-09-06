import type { Company } from "../interface/Company";

export class CompanyService {
  private readonly BASE_URL: string = 'http://localhost:8080/api/companies';
  
  async getCompanies(): Promise<Company[]> {
    const response = await fetch(this.BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch companies');
    }
    return response.json();
  }

  async createCompany(company: Partial<Company>): Promise<Company> {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    if (!response.ok) {
      throw new Error('Failed to create company');
    }
    return response.json();
  }

  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    if (!response.ok) {
      throw new Error('Failed to update company');
    }
    return response.json();
  }
}