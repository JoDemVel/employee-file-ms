import type { Department } from "../interfaces/department";
import { departments } from "./departments";

export async function getMockDepartments(companyId: string): Promise<Department[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredDepartments = departments.filter(department => department.companyId === companyId);
      resolve(filteredDepartments);
    }, 250);
  });
}

export async function getMockDepartmentById(departmentId: string): Promise<Department | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const department = departments.find(dept => dept.id === departmentId);
      resolve(department);
    }, 250);
  });
}

export async function addDepartment(department: Omit<Department, "id">): Promise<Department> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDepartment: Department = {
        ...department,
        id: crypto.randomUUID(),
      };
      departments.push(newDepartment);
      resolve(newDepartment);
    }, 250);
  });
}