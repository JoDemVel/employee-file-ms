import type { Department } from '../interface/Department';
import type { DepartmentCreateRequest } from '../interface/request/DepartmentCreateRequest';

export class DepartmentService {
  private readonly BASE_URL: string = 'http://localhost:8080/api/departments';

  // POST /api/departments - Create a new Department
  async createDepartment(
    departmentData: DepartmentCreateRequest
  ): Promise<Department> {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create department');
    }

    return response.json();
  }

  // GET /api/departments/company/{companyId} - Get departments by company ID
  async getDepartmentsByCompany(companyId: string): Promise<Department[]> {
    const response = await fetch(`${this.BASE_URL}/company/${companyId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch departments by company');
    }

    return response.json();
  }

  // PATCH /api/departments/{id} - Update a Department
  async updateDepartment(
    id: string,
    departmentData: Partial<Department>
  ): Promise<Department> {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(departmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to update department');
    }

    return response.json();
  }
}
