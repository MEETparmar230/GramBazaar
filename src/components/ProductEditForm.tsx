"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().min(0, "Price can't be negative"),
  imageUrl: z.string().min(2, "Invalid image URL"),
  imageId: z.string().min(2, "Missing image ID"),
  description: z.string(),
})

type CloudinaryUploadResult = {
  info: {
    secure_url: string
    public_id: string
  }
}

function SkeletonInput() {
  return <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
}

function SkeletonButton({ width = "w-40" }: { width?: string }) {
  return <div className={`h-10 ${width} bg-gray-200 animate-pulse rounded-md`}></div>
}

export default function ProductForm({ id }: { id: string }) {
  const router = useRouter()

  const [url, setUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: undefined, // 👈 empty instead of 0
      imageUrl: "",
      imageId: "",
      description: "",
    },
  })

  const preset: string = process.env.NEXT_PUBLIC_PRESET_NAME!

  useEffect(() => {
    setLoading(true)
    axios
      .get(`/api/admin/product/${id}`)
      .then((res) => {
        const product = res.data.product
        form.reset({
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          imageId: product.imageId,
          description: product.description,
        })
        setUrl(product.imageUrl)
      })
      .catch((err) => {
        console.error("Error fetching product", err)
      })
      .finally(() => setLoading(false))
  }, [id, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitLoading(true)
    axios
      .put(`/api/admin/product/${id}`, values)
      .then(() => {
        router.push("/products")
        form.reset()
        setUrl("")
        
      })
      .catch((err) => {
        console.error("Error updating product", err)
      })
      .finally(() => setSubmitLoading(false))
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-7 mx-auto min-w-fit max-w-[33%] bg-white p-5 rounded-lg my-5 ring-2 ring-green-200"
      >
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                {loading ? <SkeletonInput /> : <Input placeholder="Title" {...field} />}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                {loading ? (
                  <SkeletonInput />
                ) : (
                  <Input
                    placeholder="Price"
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                {loading ? <SkeletonInput /> : <Input placeholder="Description" {...field} />}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
       <FormField
  control={form.control}
  name="imageUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Product Image</FormLabel>
      <FormControl>
        <CldUploadWidget
          uploadPreset={preset}
          onSuccess={(results) => {
            if (typeof results !== "string") {
              const info = (results as CloudinaryUploadResult).info
              if (info?.secure_url) {
                // ✅ Force-refresh preview with timestamp
                const freshUrl = `${info.secure_url}?v=${Date.now()}`
                setImageLoading(true)
                setUrl(freshUrl)
                field.onChange(freshUrl)
                form.setValue("imageId", info.public_id)
              }
            }
            setUploading(false) // ✅ always reset uploading
          }}
          onError={() => setUploading(false)}
        >
          {({ open }) => (
            uploading ? (
              <SkeletonButton />
            ) : (
              <Button
                type="button"
                variant="my"
                onClick={() => {
                  setUploading(true) // ✅ move here so skeleton only shows when modal is open
                  open()
                }}
                disabled={uploading}
              >
                Upload an Image
              </Button>
            )
          )}
        </CldUploadWidget>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

{/* Image Preview */}
{url && (
  <div className="relative h-[200px] w-[300px]">
    {imageLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <SkeletonButton width="w-full" />
      </div>
    )}
    <CldImage
      className="p-2 ring-2 ring-green-200 rounded object-cover transition-opacity duration-500"
      src={url}
      alt="Preview"
      width={150}
      height={150}
      onLoad={() => setImageLoading(false)}
    />
  </div>
)}


        {/* Submit Button */}
        <div className="w-fit ms-auto">
          
        
            <Button type="submit" variant="my" size="lg" className="text-md">
              {submitLoading ? "Submitting...":"Submit"}
            </Button>
         
        </div>
      </form>
    </Form>
  )
}
