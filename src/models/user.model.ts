export interface UserAddressCoordinates {
  lat: number | null;
  lng: number | null;
}

export interface UserAddress {
  address: string;
  city: string;
  state: string;
  stateCode?: string;
  postalCode: string;
  coordinates?: UserAddressCoordinates;
  country?: string;
}

export interface UserCompanyAddress {
  address: string;
  city: string;
  state: string;
  stateCode?: string;
  postalCode: string;
  coordinates?: UserAddressCoordinates;
  country?: string;
}

export interface UserCompany {
  department: string;
  name: string;
  title: string;
  address?: UserCompanyAddress;
}

export interface UserHair {
  color: string;
  type: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone?: string;
  username: string;
  password?: string;
  birthDate?: string;
  image?: string;
  bloodGroup?: string;
  height?: number | null;
  weight?: number | null;
  eyeColor?: string;
  hair?: UserHair;
  address?: UserAddress;
  company?: UserCompany;
  role?: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  username?: string;
  role?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
}

export interface DeleteUserResponse extends User {
  isDeleted: boolean;
  deletedOn: string;
}

export interface UserQueryParams {
  limit?: number;
  skip?: number;
  select?: string;
  [key: string]: string | number | boolean | undefined;
}
