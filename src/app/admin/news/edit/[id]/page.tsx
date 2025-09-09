"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NewsInput, newsSchema } from "@/lib/validations/news"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

function SkeletonInput({ width = "w-full", height = "h-10" }: { width?: string; height?: string }) {
  return <div className={`${width} ${height} bg-gray-200 animate-pulse rounded-md`} />
}

export default function EditNews() {
  const [loading, setLoading] = React.useState(true)
  const[sLoading,setSLoading] = React.useState(false)
  const form = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      date: undefined,
    },
  })
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  React.useEffect(() => {
    if (!id) return
    setLoading(true)
    axios
      .get(`/api/admin/news/${id}`)
      .then((res) => {
        const news = res.data.news
        form.reset({
          title: news.title,
          description: news.description,
          link: news.link,
          date: new Date(news.date),
        })
      })
      .catch((err) => {
        console.error(err.response?.data || err.message)
      })
      .finally(() => setLoading(false))
  }, [id, form])

  function onSubmit(values: NewsInput) {
    setSLoading(true)
    axios
      .put(`/api/admin/news/${id}`, values)
      .then(() => {
        router.push("/news")
      })
      .catch((err) => {
        console.error(err.response?.data || err.message)
      })
      setSLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-1/3 mx-auto p-5 my-5 bg-zinc-100 rounded-lg"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                {loading ? <SkeletonInput /> : <Input {...field} />}
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
                {loading ? <SkeletonInput /> : <Input {...field} />}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              {loading ? (
                <SkeletonInput width="w-[240px]" />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="my"
                        className={cn("w-[240px] pl-3 text-left font-normal")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Link */}
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                {loading ? <SkeletonInput /> : <Input {...field} />}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="w-fit ms-auto">
  <Button
    type="submit"
    variant="my"
    size="lg"
    disabled={loading} 
  >
    {sLoading ? "Submitting..." : "Submit"}
  </Button>
</div>
      </form>
    </Form>
  )
}
