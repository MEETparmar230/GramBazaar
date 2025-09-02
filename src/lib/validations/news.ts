import { z } from "zod";

export const newsSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.date({
  error: issue => issue.input === undefined ? "Date is Required" : "Invalid date"
}),
  link: z.union([z.url({ error: "Please Enter Valid URL" }), z.literal("")]).optional()
});

export type NewsInput = z.infer<typeof newsSchema>;