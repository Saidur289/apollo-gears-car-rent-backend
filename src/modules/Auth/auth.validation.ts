import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({ error: "Name is required" }),
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    role: z.enum([Role.USER, Role.DRIVER]).optional(),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email format"),
    password: z.string({ error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ error: "Refresh token is required" }),
  }),
});

export const authValidationSchema = {
  register: registerValidationSchema,
  login: loginValidationSchema,
  refreshToken: refreshTokenValidationSchema,
};
