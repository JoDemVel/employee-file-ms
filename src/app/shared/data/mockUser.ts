import type { PaginationResponse } from '@/app/shared/interfaces/table';
import type { User } from '@/app/shared/interfaces/user';
import { mockUsers } from '@/app/shared/data/users';

export async function fetchUsersWithPagination(
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  companyId: string
): Promise<PaginationResponse<User>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredUsers = mockUsers;
      if (search) {
        const lowerCaseSearch = search.toLowerCase();
        filteredUsers = mockUsers.filter(
          (user) =>
            user.firstName.toLowerCase().includes(lowerCaseSearch) ||
            user.lastName.toLowerCase().includes(lowerCaseSearch) ||
            user.email.toLowerCase().includes(lowerCaseSearch) ||
            user.department.toLowerCase().includes(lowerCaseSearch) ||
            user.position.toLowerCase().includes(lowerCaseSearch)
        );
      }
      filteredUsers = filteredUsers.filter((user) => {
        return user.companyId === companyId;
      });

      const totalUsers = filteredUsers.length;

      const startIndex = (page - 1) * pageSize;

      const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + pageSize
      );

      const totalPages = Math.ceil(totalUsers / pageSize);

      const response: PaginationResponse<User> = {
        data: paginatedUsers,
        total: totalUsers,
        page: page,
        pageSize: pageSize,
        totalPages: totalPages,
      };

      resolve(response);
    }, 250);
  });
}

export async function fetchUserById(id: string): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === id);

      resolve(user || null);
    }, 250);
  });
}

export async function addUser(user: Omit<User, "id">): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = { ...user, id: `user-${mockUsers.length + 1}` };
      mockUsers.push(newUser);
      resolve(newUser);
    }, 250);
  });
}

export async function updateUser(user: User): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockUsers.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        mockUsers[index] = user;
        resolve(user);
      } else {
        resolve(null);
      }
    }, 250);
  });
}
