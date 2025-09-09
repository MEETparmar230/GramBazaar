import z from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least two characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z
      .string()
      .min(10, "Number must be of 10 digits")
      .max(10, "Number must be of 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
