export interface BaseSalary {
  id: string;
  employeeId: string;
  employeeFirstName: string;
  employeeLastName: string;
  amount: number;
  startDate: string;
  endDate: string | null;
}
