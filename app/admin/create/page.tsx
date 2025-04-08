"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
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
const objectWithIdAndTitle = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.id && !data.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either ID or Title must be provided.",
        path: [], // applies to the whole object
      });
    }

    if (data.id && !data.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title is required when ID is present (Edit mode).",
        path: ["title"],
      });
    }

    if (!data.id && data.title && data.title.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Title cannot be empty.",
        path: ["title"],
      });
    }
  });

const formSchema = z.object({
  topic: objectWithIdAndTitle,
  question: objectWithIdAndTitle,
 
  surah: z.string().min(1,{message:"Please select a Surah"}),
  answers: z
    .array(
      z.object({
        id: z.string().optional(),
        types: z.array(
          z.object({
            id: z.string().optional(),
            //type is typeId
            type: z.string().min(1, { message: "Please select a type." }),
            text: z.string().min(1, { message: "Please provide text." }),
            reference: z.string().optional(),
          })
        ),
      })
    )
    .min(1, { message: "Please provide at least one answer." }),
});

export default function ProfileForm() {

  const params = useSearchParams();
  const qId = params.get("qId");
  const [hasInitialized, setHasInitialized] = useState(false);
  const onCreate = useMutation(api.admin.create);
  const onSave = useMutation(api.admin.save);
  const qData = qId
    ? (useQuery(api.admin.getAns, { qId: qId as Id<"Questions"> }) as
        | ResponseData
        | undefined)
    : null;
  console.log(qData, "qData");

  const [editInput, setEditInput] = useState(qId !== null ? true : false);
  const [editMode,setEditMode]=useState(qId !== null ? true : false)
  //editInput set true disables all inputs. I referred to editInput as editInput mode so initially all should be disabled={true}
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: {title:"",id:""},

      question: {id:"",title:""},
      surah:"",
      answers: [{ types: [{ text: "", type: "", reference: "" }] }],
    },
  });

  const {
    formState: { errors, isSubmitting,isDirty, dirtyFields },
    setValue,
    getValues
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
    console.log("Hello")
    console.log(values, " values");
    console.log(isDirty," isDirty ",dirtyFields) 
    const data = {}

    //check id
    if(qData){
      // if(values.tId == qData[1]?.topic[0]._id){
      //   //if topic not editInputed, it's id. if editInputed, it's text. but tId is same. 
      //   const origTopic = topics?.filter(t=>t._id === values.tId )
      //   if(values.topic !== values.tId && origTopic[0].topic !== values.topic)
      //   data["topic"] = values.topic;
      // }

    }
    
    // compare with qData & send changed fields. 
    // 
    
    //   await onSave(values)
    // const updatedValues = {
    //   ...values,
    //   surah: values.surah as Id<"Surahs">,
    //   //editInput kalia we will add ids of everything.
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


  useEffect(() => {
    if (qData && !hasInitialized) {
      form.reset({
        topic:{id: qData[1]?.topic[0]._id, title:qData[1]?.topic[0].topic },
        question: {id:qId as string, title:qData[2].qTitle},
        
        surah: qData[2]?.qSurah._id,
        answers: qData[0].map((answer) => ({
          id: answer._id,
          types: answer.type.map((t) => ({
            id: t._id,
            type: t.type_id,
            typeId: t.type_id,
            text: t.content,
            reference: t.reference,
          })),
        })),
      });
      setHasInitialized(true); // Prevents loop

    }
  }, [qData, hasInitialized, qId]);

  const findLabel = ({
    type,
    id = "",
    text = "",
    answerIndex,
    typeIndex,
  }: {
    type: "Topic" | "Question"|"Type";
    id?: string;
    text?: string;
    answerIndex?:number;
    typeIndex?:number;

  }) => {
    console.log(type,answerIndex,typeIndex, type==="Type" && answerIndex && typeIndex)
    if(editMode){
// need both text & id. 
// if change option, receive id only. if input, receive text only but we need to keeep prev id.
      if (type === "Topic") {
        const topic = topics?.find((t) => t._id === id);
        const oldTopicId = getValues("topic.id")

        setValue("topic", {id: id=="" ? oldTopicId : id, title: text=="" && topic ? topic.topic : text});
      }

      //set only id if CREATE & option. set only name if CREATE & text.

      
          if (type === "Question") {
          
            const ques = questions?.find((q) => q._id == id);
            const oldQuesId = getValues("question.id")
            setValue("question", {id:id==""? oldQuesId:id, title: text=="" && ques ? ques.title:text} );
          }


          if (
            type === "Type" &&
            typeof answerIndex === "number" &&
            typeof typeIndex === "number"
          ){         
             const oldAnswer = getValues("answers");

          const oldTypes = oldAnswer[answerIndex]?.types[typeIndex]
          setValue( `answers.${answerIndex}.types.${typeIndex}.type`, id==""?oldTypes.type:id ) 
          setValue( `answers.${answerIndex}.types.${typeIndex}.text`,text=="" && oldTypes ? oldTypes.text:text) 
      
          }
      
    }else{
      if (type === "Topic") {
        const topic = topics?.find((t) => t._id === id);
        const oldTopicId = getValues("topic.id")

        setValue("topic", {id , title: text});
      }

      if (type === "Question") {
          
       
        setValue("question", {id, title: text} );
      }

      if (
        type === "Type" &&
        typeof answerIndex === "number" &&
        typeof typeIndex === "number"
      ){
const types = getValues("answers")
console.log(types," old types")             
          setValue( `answers.${answerIndex}.types.${typeIndex}.type`,id) 
          setValue( `answers.${answerIndex}.types.${typeIndex}.text`,text) 
      
        }
    }
  };

  const resetField = (type: "Topic" | "Question") => {
   
  };

  const top = getValues("answers");
  console.log("topic  ", top)
  return (
    <div className="w-full font-sans h-full flex flex-col flex-1 text-sm pb-4 justify-center items-center overflow-hidden">
      <Button onClick={()=>resetField("Topic")}>TOPIC RESET</Button>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col h-[98%] w-full overflow-auto p-2"
        >
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => {
              return (
                <ItemForm
                  field={field}
                  label="Topic"
                  findLabel={findLabel}
                  resetField={resetField}
                  editInput={editInput}
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
              );
            }}
          />
          <FormField
            control={form.control}
            name="surah"
            render={({ field }) => (
              <ItemForm
                editInput={editInput}
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
                editInput={editInput}
                field={field}

                label="Question"
                findLabel={findLabel}
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

          {answersFields.map((answerField, answerIndex) => (
            <AnswerItem
              key={answerField.id}
              control={form.control}
              answerIndex={answerIndex}
              ansLength={answersFields.length}
              onRemoveAnswer={() => removeAnswer(answerIndex)}
              types={types}
              findLabel={findLabel}
              editInput={editInput}
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
          {qId ? (
            <div className="flex flex-row gap-3 w-full justify-center">
              <Button type="button" onClick={() => setEditInput(false)}>
                {editInput ? "editInput" : "editInputing.."}
              </Button>
              <Button type="submit">Save</Button>
              <Button type="button">Upload</Button>
            </div>
          ) : (
            <Button
              disabled={isSubmitting}
              className="w-[400px] ml-auto mr-auto text-lg text-white"
              type="submit"
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
