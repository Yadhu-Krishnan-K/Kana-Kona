import * as z from 'zod'

// normalize spaces: "a     b" → "a b"
const normalizeSpaces = (val) => val.trim().replace(/\s+/g, " ");



export const signupSchema = z.object({
  fullName: z
    .string()
    .transform(normalizeSpaces)
    .refine(val => val.length >= 3, {
      message: "Name must be at least 3 characters",
    })
    .refine(val => /^[A-Za-z ]+$/.test(val), {
      message: "Name can only contain letters and spaces",
    }),

  email: z
    .string()
    .trim()
    .email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long")
    .refine(val => !/\s/.test(val), {
      message: "Password cannot contain spaces",
    })
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^A-Za-z0-9]/, "Must include a special character")
});



export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email"),

    password: z
        .string()
        .trim()
        .min(1, "Password is required"),
});



export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email"),
});



export const resetPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email(),

    otp: z
        .string()
        .length(6, "OTP must be 6 digits"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(50)
        .refine(val => !/\s/.test(val), {
            message: "Password cannot contain spaces",
        })
        .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[a-z]/, "Must include lowercase letter")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^A-Za-z0-9]/, "Must include a special character")
});