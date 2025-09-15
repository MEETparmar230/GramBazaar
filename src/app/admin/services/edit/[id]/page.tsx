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
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  imageId: z.string().min(2, {
    message: "Didn't get imageId from Cloudinary.",
  }),
})

type CloudinaryUploadResult = {
  info?: {
    public_id: string
  }
}

export default function EditServicePage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const preset = process.env.NEXT_PUBLIC_PRESET_NAME!
  const [imageId, setImageId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      imageId: "",
    },
  })

  // Fetch service on mount
  useEffect(() => {
    if (!id) return
    setLoading(true)

    axios
      .get(`/api/admin/services/${id}`)
      .then((res) => {
        const service = res.data?.service
        form.reset({
          name: service.name,
          description: service.description,
          imageId: service.imageId,
        })
        setImageId(service.imageId)
      })
      .catch((err) => {
        console.error(err.response?.data || err.message)
      })
      .finally(() => setLoading(false))
  }, [id, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)
    try {
      await axios.put(`/api/admin/services/${id}`, values)
      router.push("/services")
    } catch (error) {
      console.error("Update failed:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
    <div className="space-y-6 md:mx-auto md:min-w-fit md:max-w-1/3 bg-white p-5 mx-2 rounded-lg md:my-10 my-4 ring-2 ring-green-200 animate-pulse">
      {/* Name */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-gray-300 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 w-28 bg-gray-300 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      {/* Upload */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* Image preview */}
      <div className="h-32 w-32 bg-gray-200 rounded-lg"></div>

      {/* Submit */}
      <div className="h-10 w-32 bg-gray-300 rounded"></div>
    </div>
  )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:mx-auto md:min-w-fit md:max-w-1/3 mx-2 bg-white p-5 rounded-lg my-5 ring-2 ring-green-200">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Service description" {...field} />
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
              <FormLabel>Upload Image</FormLabel>
              <FormControl>
                <CldUploadWidget
                  uploadPreset={preset}
                  onSuccess={(results) => {
                    const typedResults = results as CloudinaryUploadResult
                    if (typedResults.info?.public_id) {
                      form.setValue("imageId", typedResults.info.public_id)
                      setImageId(typedResults.info.public_id)
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      className="bg-lime-600 text-white px-3 py-1 rounded hover:bg-lime-800"
                      onClick={() => open()}
                    >
                      Upload
                    </button>
                  )}
                </CldUploadWidget>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preview */}
        {imageId && (
         
          <CldImage
            width="150"
            height="150"
            src={imageId}
            alt="Service preview"
            className="rounded ring-2 ring-green-200 p-2"
          />
          
        )}

        {/* Submit */}
        <div className="w-fit ms-auto">
        <Button type="submit" disabled={submitting} variant={"my"} className="">
          {submitting ? "Updating..." : "Update Service"}
        </Button>
        </div>
      </form>
    </Form>
  )
}
