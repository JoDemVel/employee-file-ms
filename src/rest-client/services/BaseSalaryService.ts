import type { BaseSalaryCreateRequest } from '../interface/request/BaseSalaryCreateRequest';
import type { BaseSalaryResponse } from '../interface/response/BaseSalaryResponse';

export class BaseSalaryService {
  private readonly BASE_URL: string = 'http://localhost:8080/api/base-salaries';

  // POST /api/base-salaries - Create a new Base Salary and associate an user
  async createBaseSalary(
    baseSalaryData: BaseSalaryCreateRequest
  ): Promise<BaseSalaryResponse> {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(baseSalaryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create base salary');
    }

    return response.json();
  }

  // GET /api/base-salaries/employee/{employeeId} - Get base salary by employeeId
  async getBaseSalaryByEmployee(
    employeeId: string
  ): Promise<BaseSalaryResponse> {
    const response = await fetch(`${this.BASE_URL}/employee/${employeeId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch base salary by employee');
    }

    return response.json();
  }
}
