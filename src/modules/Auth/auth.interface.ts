import { Role } from "../../../generated/prisma/enums";

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "DRIVER";
};

export type TLoginUser = {
  email: string;
  password: string;
};

export type TUser = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  profileImage: string | null;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TAuthResponse = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TRefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
