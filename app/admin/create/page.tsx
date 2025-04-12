"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, UseFieldArrayRemove, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ItemForm from "../components/ItemForm";
import { Doc, Id } from "@/convex/_generated/dataModel";
import DataList from "../components/DataList";
import AnswerItem from "../components/AnswerItem";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect,  useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import DeleteWarning from "../components/DeleteWarning";

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
  topic: z
    .object({
      id: z.string().optional(),
      title: z.string().optional(),
    })
    .refine((val) => val.title?.trim() || val.id?.trim(), {
      message: "Please select a topic",
    }),
  question: z.object({
    id: z.string().optional(),
    title: z.string().optional(),
  }),

  surah: z.string().min(1, { message: "Please select a Surah" }),
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
type FormData = z.infer<typeof formSchema>;


export default function ProfileForm() {
  const params = useSearchParams();
  const qId = params.get("qId");


  const onCreate = useMutation(api.admin.create);
  const onSave = useMutation(api.admin.save);
  const upload = useMutation(api.admin.accept)
  const delAns = useMutation(api.answers.del);
  const delType = useMutation(api.answers.delAnsType)
  const delAll = useMutation(api.questions.del)

  const router = useRouter();
  const qData = useQuery(api.admin.getAns, 
    qId ? { qId: qId as Id<"Questions"> } : "skip"
  ) as ResponseData | undefined;  

const origData = qData
  ? {
      topic: {
        id: qData[1]?.topic?.[0]?._id, // Use optional chaining to avoid errors if topic or qData[1] is undefined
        title: qData[1]?.topic?.[0]?.topic, // Similarly handle title
      },
      question: {
        id: qId as string,
        title: qData[2]?.qTitle, // Ensure qData[2] is defined before accessing qTitle
      },
      surah: qData[2]?.qSurah?._id, // Safely access qSurah and _id
      answers: qData[0]?.map((answer) => ({
        id: answer._id, // Make sure answer is defined
        types: answer.type?.map((t) => ({
          id: t._id, // Make sure t is defined
          type: t.type_id,
          typeId: t.type_id,
          text: t.content,
          reference: t.reference,
        })) || [], // Default to empty array if answer.type is undefined
      })) || [], // Default to empty array if qData[0] is undefined
    }
  : null;

  const [editInput, setEditInput] = useState(qId !== null ? true : false);
  const [editMode, setEditMode] = useState(qId !== null ? true : false);
  const {toast} = useToast()
  //editInput set true disables all inputs. I referred to editInput as editInput mode so initially all should be disabled={true}
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: { title: "", id: "" },

      question: { id: "", title: "" },
      surah: "",
      answers: [{ types: [{ text: "", type: "", reference: "", id: "" }] ,id:""}],
    },
  });

  const {
    formState: { errors, isSubmitting, isDirty, dirtyFields },
    setValue,
    getValues,
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

  async function onSubmit(values: FormData, e: React.BaseSyntheticEvent)
 
  {
    console.log("hello")

    const data: {
      topic?: { id?: string; title?: string };
      surah?: Id<"Surahs">;
      question?: { id?: string; title?: string };
      answers?: {
        types: {
          type: string;
          text: string;
          id?: string;
          reference?: string;
        }[];
        id?: string;
      }[];

    } = {};
if(values.surah){

  values.surah = values.surah as Id<"Surahs">
}
    const nativeEvent = e.nativeEvent as SubmitEvent;
    const button = nativeEvent.submitter as HTMLButtonElement;
        const action = button?.value;
    if (qData && origData && editMode) {
      if (
        values.topic.id !== origData.topic.id ||
        values.topic.title !== origData.topic.title
      ) {
        data.topic = values.topic;
      } else {
//        data.topic = values.topic;
      }

      if (
        values.question.id !== origData.question.id ||
        values.question.title !== origData.question.title
      ) {
        data.question = values.question;
      } else {
   //     data.question = values.question;
      }
      
      if (values.surah !== origData.surah) {
        data.surah = values.surah as Id<"Surahs">;
      }
      
      const changedAnswers = values.answers.flatMap((ans:{
        types: {
            type: string;
            text: string;
            id?: string;
            reference?: string;
        }[];
        id?: string;
    }
        
        
        
        , i:number) => {
        // Check if this answer exists and has required fields
        if (!ans?.id || !ans.types) return [];
      
        const ansId = ans.id;
        const origAns = origData.answers.filter((o) => o.id === ansId);
      
        // Completely new answer (not found in original)
        if (origAns.length === 0) {
          return [{ ...ans }];
        }


        const changedTypes   = ans.types
        .map((t, j:number) => {
          const origT = origAns[0].types[j];
          if (
            !origT ||
            t.type !== origT.type ||
            t.text !== origT.text ||
            t.reference !== origT.reference
          ) {
            return t;
          }
          return undefined; // ✅ be explicit
        })
        .filter((t): t is typeof t => t !== undefined)  as { type: string; text: string; id: string; reference?: string }[];

      
          
        if (changedTypes.length > 0) {
          return [{ id: ans.id, types: changedTypes }];
        }
      
        return [];
      });
      
        
      
        
      
      if (changedAnswers.length > 0) {
        data.answers = changedAnswers;
      }
    }
    console.log(data, " data")
    if(Object.keys(data).length===0 && editMode && action!=="upload"){
      return;
    }
    

      data.topic = values.topic;
      data.question = values.question
      // @ts-ignore
       const result = await onCreate(editMode ? data : values);
       if(result==="success"){
         toast({
           title:`${editMode?"Saved":"Submitted"} successfully!`
         })
       }
       if(action==="upload"){
         const result = await upload({topicId:values.topic.id as Id<"Topics">, qId:values.question.id as Id<"Questions">,
           ansId:answers[0].id as Id<"Answers">
         })
         if(result==="success"){
           toast({
             title:"Uploaded successfully!"
           })
           router.push("/admin/manage")
         }
       }
       
     
  }
  const topics = useQuery(api.topics.get);
  const questions = useQuery(api.questions.get, { status: "approved" });
  const surahs = useQuery(api.surahs.get);
  const types = useQuery(api.types.get);
 
  useEffect(() => {
    if (qData  && origData) {
      form.reset(origData);
      console.log(origData)
    }
  }, [qData, qId]);

  const findLabel = ({
    type,
    id = "",
    text = "",
    answerIndex,
    typeIndex,
  }: {
    type: "Topic" | "Question" | "Type";
    id?: string;
    text?: string;
    answerIndex?: number;
    typeIndex?: number;
  }) => {
    if (editMode) {
      // need both text & id.
      // if change option, receive id only. if input, receive text only but we need to keeep prev id.
      if (type === "Topic") {
        const topic = topics?.find((t) => t._id === id);
        const oldTopicId = getValues("topic.id");

        setValue("topic", {
          id: id == "" ? oldTopicId : id,
          title: text == "" && topic ? topic.topic : text,
        });
      }

      //set only id if CREATE & option. set only name if CREATE & text.

      if (type === "Question") {
        const ques = questions?.find((q) => q._id == id);
        const oldQuesId = getValues("question.id");

        setValue("question", {
          id: id == "" ? oldQuesId : id,
          title: text == "" && ques ? ques.title : text,
        });
      }

      if (
        type === "Type" &&
        typeof answerIndex === "number" &&
        typeof typeIndex === "number"
      ) {
        const oldAnswer = getValues("answers");

        const oldTypes = oldAnswer[answerIndex]?.types[typeIndex];
        setValue(
          `answers.${answerIndex}.types.${typeIndex}.type`,
          id == "" ? oldTypes.type : id
        );
        setValue(
          `answers.${answerIndex}.types.${typeIndex}.text`,
          text == "" && oldTypes ? oldTypes.text : text
        );
      }
    } else {
      if (type === "Topic") {
        const topic = topics?.find((t) => t._id === id);
        const oldTopicId = getValues("topic.id");
        setValue("topic", { id, title: text });
      }

      if (type === "Question") {
        setValue("question", { id, title: text });
      }

      if (
        type === "Type" &&
        typeof answerIndex === "number" &&
        typeof typeIndex === "number"
      ) {
        const types = getValues("answers");
        setValue(`answers.${answerIndex}.types.${typeIndex}.type`, id);
        setValue(`answers.${answerIndex}.types.${typeIndex}.text`, text);
      }
    }
  };

  const resetField = (type: "Topic" | "Question") => {};


const deleteAns = async(answerIndex:number)=>{
  if(editMode){
    const ansId = getValues(`answers.${answerIndex}.id`)
    console.log("del answer ",ansId," ansId")
      ansId && await delAns({ansIds:[ansId as Id<"Answers">]})
    
  }
  removeAnswer(answerIndex)

}

const deleteAnsType=async(answerIndex:number,typeIndex:number, remove:UseFieldArrayRemove)=>{
  remove(typeIndex)
  if(editMode){

    const typeId =getValues(`answers.${answerIndex}.types.${typeIndex}.id`)
    typeId && await delType({id:typeId as Id<"Ans_Types">})
  }

}

  return (
    <div className="w-full font-sans h-full  flex flex-col flex-1 text-sm pb-4 justify-center items-center overflow-hidden ">
      <Button onClick={() => resetField("Topic")}>TOPIC RESET</Button>
      <Form {...form}>
        <form
  onSubmit={(e) => form.handleSubmit((data) => onSubmit(data, e))(e)}
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
            render={({ field }) => 
              
              editMode ?
              <FormItem className="h-fit py-10 ">
                <FormLabel className="text-md">Question</FormLabel>
<FormControl>

                <Input placeholder="Enter new ..." {...field} disabled={editInput} value={  field.value.title} onChange={(e)=> findLabel && findLabel({type:"Question",text:e.target.value})   }/>
</FormControl>
              </FormItem>

              :
              <ItemForm
                editInput={editInput}
                field={field}
                label="Question"
                findLabel={findLabel}
                datalist={!editMode ?
                  <DataList
                    data={questions as Doc<"Questions">[]}
                    mapFn={(q) => ({
                      value: q._id,
                      label: q.title,
                    })}
                  />:null
                }
              />
            }
          />

          {answersFields.map((answerField, answerIndex) => (
            <AnswerItem
              key={answerField.id}
              control={form.control}
              answerIndex={answerIndex}
              ansLength={answersFields.length}
              onRemoveAnswer={() => deleteAns(answerIndex)}
              onRemoveType = {deleteAnsType}
              types={types}
              findLabel={findLabel}
              editInput={editInput}
            />
          ))}

          <Button
            type="button"
            onClick={() =>
              appendAnswer({ types: [{ text: "", type: "", reference: "",id:"" }],id:"" })
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
                {editInput ? "Edit" : "Editing.."}
              </Button>
              <Button type="submit"  >Save</Button>
              <Button type="submit" value="upload">Upload</Button>
              <AlertDialog>
                <AlertDialogTrigger >

              <Button type="button" variant={"destructive"} 
              >Delete All</Button>
              </AlertDialogTrigger>
<DeleteWarning qId={origData && origData.question.id}/>
              </AlertDialog>
            </div>
          ) : (
            <Button
              disabled={isSubmitting}
              className="w-[400px] ml-auto mr-auto text-lg text-white"
              type="submit"
              name="submit"
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

//alert dialog for delete All/ delete type
// toast for submitting/edit/upload/save
