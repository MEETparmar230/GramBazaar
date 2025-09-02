import z from "zod";

export const productSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price can't be Nagative"
  }),
  imageUrl: z.string().min(2, {
    message: "Didn't get url from cloudinary"
  }),
  imageId: z.string().min(2, {
    message: "Didn't get url from cloudinary"
  }),
  description: z.string()
})

export type ProductInput = z.infer<typeof productSchema>

