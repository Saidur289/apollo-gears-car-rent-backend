import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  // Set refresh token in cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, httpStatus.CREATED, true, "User registered successfully", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);

  // Set refresh token in cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, httpStatus.OK, true, "User logged in successfully", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshAccessToken(refreshToken);

  sendResponse(
    res,
    httpStatus.OK,
    true,
    "Access token refreshed successfully",
    result,
  );
});

export const AuthController = {
  registerUser,
  loginUser,
  refreshAccessToken,
};
