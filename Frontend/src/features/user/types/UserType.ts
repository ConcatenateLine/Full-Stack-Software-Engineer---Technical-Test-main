export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  address?: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
  };
  profilePicture?: string;
};
