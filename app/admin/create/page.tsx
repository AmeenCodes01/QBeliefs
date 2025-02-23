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
import { Doc, Id } from "@/convex/_generated/dataModel"
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
  const questions = useQuery(api.questions.get,{status:"approved"})
  const surahs = useQuery(api.surahs.get)
  const types = useQuery(api.types.get)
  console.log(questions,"questions ")
  return (
      <div className="w-full h-full flex flex-col flex-1 text-md pb-4  justify-center items-center overflow-hidden  ">
      
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex flex-col h-[98%] w-full overflow-auto   p-2">
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
  <div key={field.id} className="flex gap-2 flex-col  ">
      <div className="border-[1px] flex items-center flex-col rounded-md border-primary p-2">
        <FormField
          control={form.control}
          name={`answers.${index}.text`}
          render={({ field }) => (
            <ItemForm field={field} label={`Answer ${index + 1}`} showInput={true} showbtn={false} />
          )}
        />
          
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

    {/* Select Input for Answer Type */}
    <FormField
      control={form.control}
      name={`answers.${index}.reference`}
      render={({ field }) => (
        <ItemForm field={field} label="Answer Reference" showInput={true} showbtn={false}/>
      )}
    />
          </div>
    {/* Text Input for Answer */}

    {/* Remove Button */}
    {index!== 0 && <Button type="button"  className="ml-auto bg-red-400" onClick={() => remove(index)}>Remove</Button>}
  </div>
))}

{/* Add Answer Button */}
<Button type="button" className="w-fit text-white ml-auto" onClick={() => append({ text: "", type: "", reference:"" })}>
  Add Answer
</Button>

          <Button className="w-[400px] ml-auto mr-auto text-lg text-white" type="submit">Submit</Button>
        </form>
      </Form>
      </div>
  )
}

// if(topic){ if (Q) }