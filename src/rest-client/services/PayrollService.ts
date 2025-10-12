import { httpClient } from "../http-client";
import type { PayrollResponse } from "../interface/response/PayrollResponse";

export class PayrollService {
  private readonly BASE_URL: string = '/payrolls';

  async getPayrollsByEmployeeId(employeeId: string): Promise<PayrollResponse> {
    return httpClient.get<PayrollResponse>(`${this.BASE_URL}/calculate/employees/${employeeId}`);
  }
}