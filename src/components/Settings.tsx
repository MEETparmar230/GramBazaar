'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from 'zod'
import { FiEdit } from "react-icons/fi";
import { FaRegWindowClose } from "react-icons/fa";


const formSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    logo: z.string().optional()
})

export default function Settings() {
    const [edit, setEdit] = useState<boolean>(false)
    const [logo, setLogo] = useState<string>("")
    const [name, setName] = useState<string>("")


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
             name: "",
      logo: "",
        },
    })

    const onsubmit = (values: z.infer<typeof formSchema>) => {
  axios.put("/api/admin/settings", values)
    .then((res) => {
      setName(res.data.name)
      setLogo(res.data.logo || "")
      setEdit(false)
    })
    .catch((err) => {
      console.log("failed to update settings", err)
    })
}


    useEffect(() => {
        axios.get("/api/admin/settings")
            .then((res) => {
                form.reset({
                    logo: res.data?.logo,
                    name: res.data?.name
                })
                setLogo(res.data?.logo)
                setName(res.data?.name)
            })
    }, [form])
    return (

        <div className='bg-zinc-100 p-5 rounded-lg w-84 '>
            <div className='flex items-center justify-between'>
             
                    <h1 className='text-center font-semibold text-2xl'>Settings </h1>
             
                {edit && <FaRegWindowClose onClick={()=>{setEdit(false)}} className='  hover:text-zinc-100 text-green-600  text-xl hover:bg-green-600 bg-zinc-100  '/>}

            </div>
            {edit ?
                (<div className='mt-4 flex flex-col gap-4'>
                    <div className='flex flex-wrap justify-start items-center gap-2'>
                        <div className='font-semibold'>Site Name :</div>
                        <input  {...form.register("name")} className='px-2 w-50  focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded' type="text" />
                        {form.formState.errors.name && (
  <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
)}
                    </div>
                    <div className='flex flex-wrap justify-start items-center gap-2'>
                        <div className='font-semibold'>Site Logo :</div>
                        <input  {...form.register("logo")} className='px-2  w-50 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded' type="text" />
                    </div>
                    <button onClick={form.handleSubmit(onsubmit)} className=' border border-green-600 hover:text-zinc-100 text-green-600 flex items-center justify-start text-md gap-2 border w-fit px-2 hover:bg-green-600 bg-zinc-100 rounded-sm'>Submit</button>

                </div>)
                :
                (<div className='mt-4 flex flex-col gap-4'>
                    <div className='flex flex-wrap justify-start items-center gap-2'>
                        <div className='text-md font-semibold'>Site Name :</div>
                        <div className=''><p>{name ? name : "Undefined"}</p></div>
                    </div>
                    <div className='flex flex-wrap justify-start items-center gap-2'>
                        <div className='font-semibold'>Site Logo :</div>
                        <div className=''><p>{logo ? logo : "Undefined"}</p></div>
                    </div>
                    <button onClick={() => { setEdit(!edit) }} className=' border border-green-600 hover:text-zinc-100 text-green-600 flex items-center justify-start text-md gap-2 border w-fit px-2 hover:bg-green-600 bg-zinc-100 rounded-sm'>Edit<FiEdit /></button>

                </div>)
            }
        </div>
    )
}
