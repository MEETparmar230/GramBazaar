import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  imageId: z.string().min(1, { message: "Image ID is required" }),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
