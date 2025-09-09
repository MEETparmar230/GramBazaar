import z from "zod";

export const loginSchema = z.object({
    email:z.email("Please enter a valid email"),
    password:z.string().min(1,"Password is required")
})

export type LoginSchemaType = z.infer<typeof loginSchema>