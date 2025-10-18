export interface VacationCreateRequest {
  employeeId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}