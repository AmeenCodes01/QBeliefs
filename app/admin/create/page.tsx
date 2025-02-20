"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import ItemForm from "../components/ItemForm"
import { Doc } from "@/convex/_generated/dataModel"
import DataList from "../components/DataList"

const formSchema = z.object({
  topic: z.string({
  }).min(1, { message: "Please select an topic.",
  }),
  question: z.string({
  }).min(1, { message: "Please select an topic.",
  }),
  answers: z.array(z.object(
    {
      text:z.string({
    }).min(1, { message: "Please select an topic.",
    }),
    type:z.string({
    }).min(1, { message: "Please select an topic.",
    },
  ),
  reference: z.string({})
  }
  )),
  // type:z.string({
  // }).min(1, { message: "Please select an topic.",
  // }),
  surah:z.string({
  }).min(1, { message: "Please select an topic.",
  }),
  
})

export default function ProfileForm() {
  
const onCreate = useMutation(api.admin.create)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      question:"",
      surah:"",
       answers:[{text:"",type:"", reference:""}], 
      // type:""
      
    },
  })
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
   control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "answers", // unique name for your Field Array
  });  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedValues = { 
      ...values, 
      surah: values.surah as Id<"Surahs"> 
    };
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    onCreate(updatedValues)
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
              {/* <FormField
                    control={form.control}
                  name="type"
                    render={({ field }) => (
                      <ItemForm field={field} label="Answer Type" datalist ={<DataList data={types as Doc<"Types">[]} mapFn={(q) => ({
                        value: q._id, 
                        label: q.name,
                      })}/>}/>
                    )}
                  /> */}
          {fields.map((field, index) => (
  <div key={field.id} className="flex gap-4 items-center">
    {/* Text Input for Answer */}
    <FormField
      control={form.control}
      name={`answers.${index}.text`}
      render={({ field }) => (
        <ItemForm field={field} label={`Answer ${index + 1}`} showInput={true} showbtn={false} />
      )}
    />

    {/* Select Input for Answer Type */}
    <FormField
      control={form.control}
      name={`answers.${index}.type`}
      render={({ field }) => (
        <ItemForm field={field} label="Answer Type" datalist={
          <DataList 
            data={types as Doc<"Types">[]} 
            mapFn={(q) => ({ value: q._id, label: q.name })}
          />
        }/>
      )}
      />
    <FormField
      control={form.control}
      name={`answers.${index}.reference`}
      render={({ field }) => (
        <ItemForm field={field} label="Answer Reference" showInput={true} showbtn={false}/>
      )}
    />

    {/* Remove Button */}
    <Button type="button" onClick={() => remove(index)}>Remove</Button>
  </div>
))}

{/* Add Answer Button */}
<Button type="button" onClick={() => append({ text: "", type: "", reference:"" })}>
  Add Answer
</Button>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      </div>
  )
}

// if(topic){ if (Q) }