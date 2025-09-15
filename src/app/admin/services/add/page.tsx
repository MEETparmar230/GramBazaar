"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  imageId: z.string().min(2, {
    message: "Image ID is required.",
  }),
  imageUrl: z.string().min(2, {
    message: "Image URL is required.",
  }),
})

type CloudinaryUploadResult = {
  info?: {
    public_id: string
    secure_url: string
  }
}

export default function AddServicepage() {
  const preset = process.env.NEXT_PUBLIC_PRESET_NAME!
  const [imageUrl, setImageUrl] = useState<string>("")
  const router = useRouter()
  const [imageUploading, setImageUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageId: "",
      imageUrl: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      await axios.post("/api/admin/services", values)
      form.reset()
      setImageUrl("")
    } catch (err) {
      console.error("Error adding service:", err)
    } finally {
      router.push("/services")
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 md:mx-auto md:min-w-fit md:max-w-1/3 mx-2 bg-white p-5 rounded-lg md:my-10 my-4 ring-2 ring-green-200"
      >
        {/* Service Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service:</FormLabel>
              <FormControl>
                <Input placeholder="Service name" {...field} />
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
              <FormLabel>Description:</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="imageId"
          render={() => (
            <FormItem>
              <FormLabel>Upload Image:</FormLabel>
              <FormControl>
                <CldUploadWidget
                  uploadPreset={preset}
                  onUploadAdded={() => setImageUploading(true)}
                  onSuccess={(results) => {
                    const typedResults = results as CloudinaryUploadResult
                    if (typedResults.info?.public_id && typedResults.info?.secure_url) {
                      form.setValue("imageId", typedResults.info.public_id)
                      form.setValue("imageUrl", typedResults.info.secure_url)
                      setImageUrl(typedResults.info.secure_url)
                    }
                    setImageUploading(false)
                  }}
                  onError={() => setImageUploading(false)}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      className="bg-lime-600 text-zinc-100 px-2 py-1 rounded-md hover:bg-lime-800 w-full"
                      onClick={() => open()}
                    >
                      {imageUploading ? "Uploading..." : "Upload"}
                    </button>
                  )}
                </CldUploadWidget>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Preview */}
        {imageUrl && !imageUploading && (
          <CldImage
            width="150"
            height="150"
            src={imageUrl}
            sizes="100vw"
            alt="Service image preview"
            className="rounded ring-2 ring-green-200"
          />
        )}

        {/* Submit */}
        <div className="ms-auto w-fit">
          <Button type="submit" variant={"my"} size={"lg"} className="text-md">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
