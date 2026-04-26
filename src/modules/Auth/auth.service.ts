import bcrypt from "bcrypt";
import httpStatus, { status } from "http-status";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from "./auth.utils";
import {
  TLoginUser,
  TRegisterUser,
  TAuthResponse,
  TRefreshTokenResponse,
} from "./auth.interface";

const registerUser = async (payload: TRegisterUser): Promise<TAuthResponse> => {
  const { name, email, password } = payload;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User already exists with this email",
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds) || 12,
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Create tokens
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createAccessToken(jwtPayload);
  const refreshToken = createRefreshToken(jwtPayload);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: TLoginUser): Promise<TAuthResponse> => {
  const { email, password } = payload;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password || "");
  if (!isPasswordValid) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials");
  }

  // Create tokens
  const jwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = createAccessToken(jwtPayload);
  const refreshToken = createRefreshToken(jwtPayload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      rating: user.rating,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (
  refreshToken: string,
): Promise<TRefreshTokenResponse> => {
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken, config.jwt.refresh_secret!);

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Create new access token
    const jwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = createAccessToken(jwtPayload);

    return { accessToken };
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
  }
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshAccessToken,
};
