import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .max(20, { message: "Password must not exceed 20 characters." })
  .refine((password) => password === undefined || password.trim() === '' || password.length >= 8, {
    message: "Password must be at least 8 characters.",
  })
  .refine((password) => password === undefined || password.trim() === '' || password.length <= 20, {
    message: "Password must not exceed 20 characters.",
  })
  .refine((password) => password === undefined || password.trim() === '' || /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter.",
  })
  .refine((password) => password === undefined || password.trim() === '' || /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter.",
  })
  .refine((password) => password === undefined || password.trim() === '' || /[0-9]/.test(password), {
    message: "Password must contain at least one number.",
  })
  .refine((password) => password === undefined || password.trim() === '' || /[!@#$%^&*]/.test(password), {
    message: "Password must contain at least one special character.",
  });