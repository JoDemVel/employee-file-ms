import type { SalaryEventCreateRequest } from '../interface/request/SalaryEventCreateRequest';
import type { SalaryEventResponse } from '../interface/response/SalaryEventResponse';

export class SalaryEventService {
  private readonly BASE_URL: string = 'http://localhost:8080/api/salary-events';

  // POST /api/salary-events - Create a new Salary Event
  async createSalaryEvent(
    salaryEventData: SalaryEventCreateRequest
  ): Promise<SalaryEventResponse> {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(salaryEventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create salary event');
    }

    return response.json();
  }

  // GET /api/salary-events/employee/{employeeId} - Get salary events by employee ID
  async getSalaryEventsByEmployee(
    employeeId: string
  ): Promise<SalaryEventResponse[]> {
    const response = await fetch(`${this.BASE_URL}/employee/${employeeId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch salary events by employee');
    }

    return response.json();
  }

  // Helper methods para filtrar por tipo
  async getBonusesByEmployee(
    employeeId: string
  ): Promise<SalaryEventResponse[]> {
    const events = await this.getSalaryEventsByEmployee(employeeId);
    return events.filter((event) => event.type === 'BONUS');
  }

  async getDeductionsByEmployee(
    employeeId: string
  ): Promise<SalaryEventResponse[]> {
    const events = await this.getSalaryEventsByEmployee(employeeId);
    return events.filter((event) => event.type === 'DEDUCTION');
  }

  async getAdvancesByEmployee(
    employeeId: string
  ): Promise<SalaryEventResponse[]> {
    const events = await this.getSalaryEventsByEmployee(employeeId);
    return events.filter((event) => event.type === 'ADVANCE');
  }
}
