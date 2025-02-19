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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ItemForm from "../components/ItemForm"
import { Doc } from "@/convex/_generated/dataModel"
import DataList from "../components/DataList"

const formSchema = z.object({
  topic: z.string({
    required_error: "Please select an topic.",
  }),
  question: z.string({
    required_error: "Please select an question.",
  }),
  answer: z.string({
    required_error: "Please type an answer.",
  }),
  type: z.string({
    required_error: "Please select the answer type or create new one.",
  }),
  surah: z.string({
    required_error: "Please select surah for Question.",
  }),
  
})

export default function ProfileForm() {
  


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      question:"",
      surah:"",
      answer:"", 
      type:""
      
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const topics = useQuery(api.topics.get)
  const questions = useQuery(api.questions.get)
  const surahs = useQuery(api.surahs.get)
  const types = useQuery(api.types.get)
  return (
      <div className="w-full h-[600px]  flex text-md justify-start ">

      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col h-full w-full max-w-7xl overflow-y-scroll">
        <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <ItemForm field={field} label="Topic" datalist ={<DataList data={topics as Doc<"Topics">[]} mapFn={(t) => ({
                value: t._id, 
                label: t.topic,
              })}/>} 
              />
            
            )}
          />
        <FormField
            control={form.control}
            name="surah"
            render={({ field }) => (
              <ItemForm field={field} label="Surah" datalist ={<DataList data={surahs as Doc<"Surahs">[]} mapFn={(s) => ({
                value: s._id, 
                label: s.name,
              })}/>} 
              showbtn={false}
              />
            
            )}
          />
        <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <ItemForm field={field} label="Question" datalist ={<DataList data={questions as Doc<"Questions">[]} mapFn={(q) => ({
                value: q._id, 
                label: q.title,
              })}/>}/>
            )}
          />

        <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <ItemForm field={field} label="Answer" showInput={true} showbtn={false}/>
            )}
          /> 
      <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <ItemForm field={field} label="Answer Type" datalist ={<DataList data={types as Doc<"Types">[]} mapFn={(q) => ({
                value: q._id, 
                label: q.name,
              })}/>}/>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      </div>
  )
}

// if(topic){ if (Q) }