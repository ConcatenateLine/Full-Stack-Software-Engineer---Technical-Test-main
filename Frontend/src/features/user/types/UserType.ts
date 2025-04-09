export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  role: string;
  status: string;
  address?: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
  };
  avatar?: File;
};
