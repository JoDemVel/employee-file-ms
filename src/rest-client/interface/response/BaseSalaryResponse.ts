export interface BaseSalaryResponse {
  id: string;
  employeeId: string;
  employeeFirstName: string;
  employeeLastName: string;
  amount: number;
  startDate: string;
  endDate?: string;
}