"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  
  FormField
  
} from "@/components/ui/form";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ItemForm from "../components/ItemForm";
import { Doc, Id } from "@/convex/_generated/dataModel";
import DataList from "../components/DataList";
import AnswerItem from "../components/AnswerItem";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



interface TypeWithName {
  _creationTime: number;
  _id: Id<"Types">;
  name: string;
  sort_order: number;
  status: string;
}

interface Type {
  _creationTime: number;
  _id: Id<"Ans_Types">;
  a_id: Id<"Answers">;
  content: string;
  reference: string;
  typeWithName: TypeWithName | null;
  type_id: Id<"Types">;
}

interface Answer {
  _creationTime: number;
  _id: Id<"Answers">;
  q_id: Id<"Questions">;
  status: string;
  type: Type[];
}

interface Topic {
  _creationTime: number;
  _id: Id<"Topics">;
  status: string;
  topic: string;
}

interface Question {
  qTitle: string;
  qStatus: string;
  qSurah: Doc<"Surahs">;
}

type ResponseData = [Answer[], { topic: Topic[] }, Question];
const formSchema = z.object({
  tId: z.string().optional(),
  topic: z.string({}).min(1, { message: "Please select a topic." }),
  question: z.string({}).min(1, { message: "Please select a question." }),
  qId: z.string().optional(),
  answers: z.array(
    z.object({
      id: z.string().optional(),
      types: z.array(
        z.object({
          id:z.string().optional(),
          type: z.string().min(1, { message: "Please select a type." }),
          typeId:z.string().optional(),
          text: z
            .string()
            .min(1, { message: "Please provide text for the type." }),
          reference: z.string().optional(),
        }),
      ),
    }),
  ).min(1,{message:"Please provide at least one answer."}),
  surah: z.string({}).min(1, { message: "Please select a surah." }),
});

export default function ProfileForm() {
  
  const params = useSearchParams();
  const qId = params.get("qId")
  
  const onCreate = useMutation(api.admin.create);
  const onSave = useMutation(api.admin.save)
  const qData = qId ? useQuery(api.admin.getAns,{qId:qId as Id<"Questions">}) as ResponseData | undefined : null
console.log(qData,"qData")


  const [edit,setEdit]=useState(qId !== null ? true: false)
  //edit set true disables all inputs. I referred to edit as edit mode so initially all should be disabled={true}
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      
      question:  "",
      surah:  "",
      answers:  [{ types: [{ text: "", type: "", reference: "" }] }]
    }
  });

  const {
    formState: {errors, isSubmitting,}, setValue
  
  } = form;

  const {
    fields: answersFields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control: form.control,
    name: "answers",
  });

  const answers = useWatch({
    control: form.control,
    name: "answers",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, " values")
   //   await onSave(values)
    // const updatedValues = {
    //   ...values,
    //   surah: values.surah as Id<"Surahs">,
    //   //edit kalia we will add ids of everything. 
    // };
    // const result =await onCreate(updatedValues);
    // if(result ==="success"){
    //   alert("Created succesfully")
    // }
  }

  const topics = useQuery(api.topics.get);
  const questions = useQuery(api.questions.get, { status: "approved" });
  const surahs = useQuery(api.surahs.get);
  const types = useQuery(api.types.get);

  console.log(topics)

  useEffect(() => {
    if (qData) {
      form.reset({
        topic:  qData[1]?.topic[0]._id ,
      tId:  qData[1]?.topic[0]._id ,
      question:  qId as string,
      qId:  qData[0][0]?.q_id ,
      surah:  qData[2]?.qSurah._id ,
      answers: qData[0].map(answer => ({
        id: answer._id,
        types: answer.type.map(t => ({
          id: t._id,
          type: t.type_id,
          typeId: t.type_id,
          text: t.content,
          reference: t.reference,
        }))
      }))
      });
    }
  }, [qData]);

const findLabel = (type: "Topic" | "Question", id: string) => {
  if (!id) return "";
  
  if (type === "Topic") {
    const topic = topics?.find(t => t._id === id);
     setValue("topic",topic ? topic.topic:"")
    return topic ? topic?.topic as string : ""; // Assuming 'title' is the label field
  }

  if(type ==="Question"){

    const ques = questions?.find(q=>q._id == id)
     setValue("question", ques?.title as string)
    return ques? ques.title : ""
  }

  const resetInput = (type:"Topic"| "Question")=>{
    if(type=="Topic"){

      setValue("topic", qData && qData[1]?.topic[0]._id as string)
    }
  }
}
  return (
    <div className="w-full font-sans h-full flex flex-col flex-1 text-sm pb-4 justify-center items-center overflow-hidden">
      <Form {...form}
     
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col h-[98%] w-full overflow-auto p-2"
        >
          <FormField
            control={form.control}
            name="topic"
            
            render={({ field }) => {
             
              return(
              <ItemForm
                field={field}
                label="Topic"
                findLabel = {findLabel}
                edit={edit}
                datalist={
                  <DataList
                    data={topics as Doc<"Topics">[]}
                    mapFn={(t) => ({
                      value: t._id,
                      label: t.topic,
                    })}
                  />
                }
              />
            )}}
          />
          <FormField
            control={form.control}
            name="surah"
            render={({ field }) => (
              <ItemForm
              edit={edit}
                field={field}
                label="Surah"
                datalist={
                  <DataList
                    data={surahs as Doc<"Surahs">[]}
                    mapFn={(s) => ({
                      value: s._id,
                      label: s.name,
                    })}
                  />
                }
                showbtn={false}
              />
            )}
          />
          <FormField
            control={form.control}
            name="question"
          
            render={({ field }) => (
              <ItemForm
              edit={edit}
                field={field}
                label="Question"
                findLabel = {findLabel}
                datalist={
                  <DataList
                    data={questions as Doc<"Questions">[]}
                    mapFn={(q) => ({
                      value: q._id,
                      label: q.title,
                    })}
                  />
                }
              />
            )}
          />

          {/* Render the `answers` array */}
          {answersFields.map((answerField, answerIndex) => (
  <AnswerItem
    key={answerField.id}
    control={form.control}
    answerIndex={answerIndex}
    ansLength ={answersFields.length}
    onRemoveAnswer={() => removeAnswer(answerIndex)}
    types={types}
    edit={edit}
  />
))}

          <Button
            type="button"
            onClick={() =>
              appendAnswer({ types: [{ text: "", type: "", reference: "" }] })
            }
            className="ml-auto"
          >
           + Add Answer
          </Button>

          {/* Add Answer button */}
        
          {/* Submit button */}
          {qId ?
          <div className="flex flex-row gap-3 w-full justify-center">

          <Button type="button"  onClick={()=> setEdit(false)}>
{edit ?"Edit": "Editing.."}
          </Button>
          <Button type="submit">
Save
          </Button>
          <Button type="button">
Upload
          </Button>
          </div>
          :
          <Button disabled={isSubmitting}
            className="w-[400px] ml-auto mr-auto text-lg text-white"
            type="submit"
          >
           {isSubmitting? "Submitting":"Submit"}
          </Button>
}       

 </form>
      </Form>
    </div>
  );
}
