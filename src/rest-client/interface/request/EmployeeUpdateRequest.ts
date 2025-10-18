export interface EmployeeUpdateRequest {
  firstName: string;
  lastName: string;
  ci: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  hireDate: string;
  status: string;
  emergencyContact: EmergencyContactRequest;
  positionId: string;
  branchId: string;
}

export interface EmergencyContactRequest {
  fullName: string;
  relation: string;
  phone: string;
  address: string;
}
