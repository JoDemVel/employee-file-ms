import type { PaginationResponse, TableFilters } from '@/app/shared/interfaces/table';
import type { User } from '@/app/shared/interfaces/user';

function generateMockUser(index: number): User {
  return {
    id: `user-${index}`,
    firstName: `Nombre${index}`,
    lastName: `Apellido${index}`,
    department: `Departamento${index % 3}`,
    position: `Cargo${index % 5}`,
    hireDate: new Date(2020, 0, index + 1).toISOString(),
    email: `usuario${index}@empresa.com`,
    phone: `+5917000000${index}`,
    companyId: `comp-${index % 2}`,
  };
}

const MOCK_USERS: User[] = Array.from({ length: 100 }, (_, i) => generateMockUser(i));

export function fetchUsersMock(
  page: number,
  pageSize: number,
  filters: TableFilters
): Promise<PaginationResponse<User>> {
  const search = filters.search?.toLowerCase() ?? '';

  const filtered = MOCK_USERS.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email} ${user.position}`.toLowerCase().includes(search)
  );

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return Promise.resolve({
    data,
    total,
    page,
    pageSize,
    totalPages,
  });
}