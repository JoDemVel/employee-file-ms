export interface User {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  avatar: string;
}

export const defaultUser = {
  firstName: 'Josue',
  lastName: 'Veliz Escobar',
  name: 'Josue Veliz Escobar',
  email: 'josue.veliz@example.com',
  avatar: '/avatars/shadcn.jpg',
};
