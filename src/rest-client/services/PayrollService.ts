import { httpClient } from "../http-client";
import type { EmployeeSearchParams } from "../interface/request/EmployeeSearchParams";
import type { PayrollResponse, PayrollSummaryPageResponse, PayrollSummaryResponse } from "../interface/response/PayrollResponse";

export class PayrollService {
  private readonly BASE_URL: string = '/payrolls';

  async getPayrollsByEmployeeId(employeeId: string): Promise<PayrollResponse> {
    return httpClient.get<PayrollResponse>(`${this.BASE_URL}/calculate/employees/${employeeId}`);
  }

  async getPayrolls(page: number = 0, size: number = 10, searchParams?: EmployeeSearchParams): Promise<PayrollSummaryPageResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (searchParams?.search) {
      params.append('search', searchParams.search);
    }
    if (searchParams?.ci) {
      params.append('ci', searchParams.ci);
    }
    if (searchParams?.email) {
      params.append('email', searchParams.email);
    }
    if (searchParams?.phone) {
      params.append('phone', searchParams.phone);
    }
    if (searchParams?.type) {
      params.append('type', searchParams.type);
    }
    if (searchParams?.branchId) {
      params.append('branchId', searchParams.branchId);
    }
    if (searchParams?.positionId) {
      params.append('positionId', searchParams.positionId);
    }

    const url = `${this.BASE_URL}/calculate?${params.toString()}`;
    return httpClient.get<PayrollSummaryPageResponse>(url);
  }

  async getAllPayrolls(): Promise<PayrollSummaryResponse> {
    return httpClient.get<PayrollSummaryResponse>(`${this.BASE_URL}/calculate/all`);
  }
}