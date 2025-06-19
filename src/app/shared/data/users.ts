export interface User {
  name: string;
  email: string;
  avatar: string;
}

export const defaultUser = {
  name: 'shadcn',
  email: 'm@example.com',
  avatar: '/avatars/shadcn.jpg',
}