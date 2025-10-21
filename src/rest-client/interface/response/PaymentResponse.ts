import type { EmployeeResponse } from "./EmployeeResponse";

export interface PaymentEmployeeResponse {
  employee: EmployeeResponse;
  payment: PaymentDetailsResponse;
}

export interface PaymentDetailsResponse {
  period: number;
  baseSalary: number;
  workedDays: number;
  basicEarnings: number;
  seniorityYears: number;
  seniorityIncreasePercentage: number;
  seniorityBonus: number;
  grossAmount: number;
  deductionAfpPercentage: number;
  deductionAfp: number;
  deductions: PaymentDeductionResponse[];
  totalDeduction: number;
  netAmount: number;
}

export interface PaymentDeductionResponse {
  type: string;
  qty: number;
  totalDeduction: number;
}