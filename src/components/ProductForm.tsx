"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation"
import { productSchema } from "@/lib/validations/products";



type CloudinaryUploadResult = {
  info: {
    secure_url: string
    public_id: string
  }
}


export default function ProductForm() {

  const router = useRouter();

  const [url, setUrl] = useState<string>("")
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);


  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      imageUrl: '',
      imageId: '',
      description: ''
    },
  })

  const preset: string = process.env.NEXT_PUBLIC_PRESET_NAME!


  function onSubmit(values: z.infer<typeof productSchema>) {
    setLoading(true)
    axios.post("/api/admin/product", values)
      .then((res) => {
        form.reset()
        setUrl('')
        router.push('/products')
      })
      .catch(err => { console.log(err) })
    setLoading(false)
  }

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-7 mx-auto min-w-fit max-w-1/3 bg-white p-5 rounded-lg my-5 ring-2 ring-green-200"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
              
                    <Input placeholder="Title" {...field} />
                  
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                  
                    <Input
                      placeholder="Price"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                 
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
                  
                    <Input placeholder="Description" {...field} />
                  
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
                  <div>
                    {imageUploading ? (
                      <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-md"></div>
                    ) : (
                      <CldUploadWidget
                        uploadPreset={preset}
                        onUpload={() => setImageUploading(true)}
                        onSuccess={(results) => {
                          if (typeof results !== "string") {
                            const info = (results as any).info;
                            if (info?.secure_url) {
                              setUrl(info.secure_url);
                              form.setValue("imageUrl", info.secure_url);
                              form.setValue("imageId", info.public_id);
                            }
                          }
                          setImageUploading(false);
                        }}
                        
                      >
                        {({ open }) => (
                          <button
                            type="button"
                            className="bg-lime-600 text-zinc-100 px-2 py-1 rounded-md hover:bg-lime-800 w-full"
                            onClick={() => open()}
                          >
                            Upload an Image
                          </button>
                        )}
                      </CldUploadWidget>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preview */}
          {url && !imageUploading ? (
            <CldImage
              className="ring-2 ring-green-200 rounded p-2"
              src={url}
              alt="Preview"
              width={150}
              height={150}
            />
          ) : imageUploading ? (
            <div className="h-36 w-36 bg-gray-200 animate-pulse rounded-md ring-2 ring-green-200"></div>
          ) : null}

          {/* Submit */}
          <div className="ms-auto w-fit">
          <Button type="submit" variant={"my"} size={"lg"} className="text-md">
            {loading ? 
              "Submiting...":"Submit"
            }
          </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}