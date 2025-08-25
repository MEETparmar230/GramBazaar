
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { CldImage, CldUploadWidget } from "next-cloudinary"
import { useState } from "react"
import axios from "axios"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  description: z.string(),

  imageId: z.string().min(2, {
    message: "didn't got imageId from cloudinary.",
  }),

})

type CloudinaryUploadResult = {
  info?: {
    public_id: string
  }
}

export default function AddServicepage() {

  const preset = process.env.NEXT_PUBLIC_PRESET_NAME!
  const [image_id,setImage_id]= useState<string>("")

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      imageId: ''
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {

    axios.post("/api/services",values)
    form.reset()
    setImage_id("")
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service:</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
              <FormLabel>description:</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CldUploadWidget uploadPreset={preset}
                  onSuccess={(results) => {
                    const typedResults=results as CloudinaryUploadResult
                    if(typedResults.info?.public_id){
                    form.setValue("imageId", typedResults.info?.public_id)
                    setImage_id(typedResults.info?.public_id)
                    }
                  }}
                >

                  {({ open }) => {
                    return (
                      <button className="button" onClick={() => open()}>
                        Upload
                      </button>
                    );
                  }}

                </CldUploadWidget>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {image_id && <CldImage
          width="960"
          height="600"
          src={image_id}
          sizes="100vw"
          alt="Description of my image"
        />}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}