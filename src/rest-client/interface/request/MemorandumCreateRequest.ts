export interface MemorandumCreateRequest {
  employeeId: string;
  type: string;
  description: string;
  memorandumDate: string;
  isPositive: boolean;
}