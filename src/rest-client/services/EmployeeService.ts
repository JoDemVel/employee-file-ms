import type { Employee } from '../interface/Employee';
import type { Page } from '../interface/Page';
import type { EmployeeCreateRequest } from '../interface/request/EmployeeCreateRequest';
import type { PageableRequest } from '../interface/request/PageableRequest';

export class EmployeeService {
  private readonly BASE_URL: string = 'http://localhost:8080/api/employees';

  // POST /api/employees - Create a new Employee
  async createEmployee(employeeData: EmployeeCreateRequest): Promise<Employee> {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to create employee');
    }

    return response.json();
  }

  // GET /api/employees/{id} - Get employee by ID
  async getEmployeeById(id: string): Promise<Employee> {
    const response = await fetch(`${this.BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch employee');
    }

    return response.json();
  }

  // GET /api/employees/company/{companyId} - Get employees by company with pagination
  async getEmployeesByCompany(
    companyId: string,
    pageable?: PageableRequest
  ): Promise<Page<Employee>> {
    let url = `${this.BASE_URL}/company/${companyId}`;

    if (pageable) {
      const params = new URLSearchParams();

      if (pageable.page !== undefined)
        params.append('page', pageable.page.toString());
      if (pageable.size !== undefined)
        params.append('size', pageable.size.toString());
      if (pageable.sort) {
        pageable.sort.forEach((sortParam) => params.append('sort', sortParam));
      }

      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch employees by company');
    }

    return response.json();
  }

  async updateEmployee(
    id: string,
    employeeData: Partial<Employee>
  ): Promise<Employee> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee');
    }

    return response.json();
  }

  async deleteEmployee(id: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete employee');
    }
  }
}
