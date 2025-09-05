import z from "zod";

export const contactSchema = z.object({
    name:z.string().min(2,"Name must be at least two characters"),
    email:z.email("Please enter a valid email"),
    message:z.string().min(10,"Message must be at least 10 characters")
})

export type ContactFormData = z.infer<typeof contactSchema>;