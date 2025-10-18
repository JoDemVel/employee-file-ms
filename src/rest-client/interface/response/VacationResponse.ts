export interface VacationResponse {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}