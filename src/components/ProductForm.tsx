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
  const [Id, setId] = useState<string>("")

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
    axios.post("/api/admin/product", values)
      .then((res) => {
        form.reset()
        setUrl('')
        router.push('/')
      })
      .catch(err => { console.log(err) })

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7 mx-auto min-w-fit max-w-1/3 bg-green-100 p-5 rounded-lg my-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input className="" placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                <Input className="" placeholder="Price" {...field} type="number" onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input className="" placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product image</FormLabel>

              <FormControl>
                <div>

                  <CldUploadWidget
                    uploadPreset={preset}
                    onSuccess={(results) => {
                      if (typeof results !== "string") {
                        const info = (results as CloudinaryUploadResult).info
                        if (info?.secure_url) {
                          setUrl(info.secure_url)
                          setId(info.public_id)

                          form.setValue("imageUrl", info.secure_url)
                          form.setValue("imageId", info.public_id)

                          console.log("uploaded", info.secure_url)
                        }
                      }
                    }}
                  >
                    {({ open }) => (
                      <button className="bg-green-700 text-zinc-100 px-2 py-1 rounded-md hover:bg-green-800" type="button" onClick={() => open()}>
                        Upload an Image
                      </button>
                    )}
                  </CldUploadWidget>

                </div>
              </FormControl>

              <FormMessage />
            </FormItem>

          )}
        />

        {url && <CldImage className="bg-zinc-200 p-5"
          src={url}
          alt="nothing"
          width={100}
          height={100}
        />}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}