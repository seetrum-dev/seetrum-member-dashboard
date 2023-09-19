import { BaseModel } from ".";

export type User = BaseModel &
  Omit<UserRegistrationData, "password"> &
  AdminRole;

export type UserType = "individual" | "organization";

export type UserRegistrationData = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userType: UserType;
  address: string;
  informationChannel: string;
  motivationToJoin: string;
  dateOfBirth?: Date;
  gender?: string;
  organization?: Organization;
};

type Organization = {
  industry: string;
  picName: string;
  picEmail: string;
  picPhoneNumber: string;
};

type AdminRole = {
  isAdmin?: boolean;
};
