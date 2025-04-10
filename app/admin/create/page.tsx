"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, UseFieldArrayRemove, useForm, useWatch } from "react-hook-form";
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
import { getAuthSessionId } from "@convex-dev/auth/server";

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

export default function ProfileForm() {
  const params = useSearchParams();
  const qId = params.get("qId");
  const [hasInitialized, setHasInitialized] = useState(false);
  const onCreate = useMutation(api.admin.create);
  const onSave = useMutation(api.admin.save);
  const upload = useMutation(api.admin.accept)
  const delAns = useMutation(api.answers.delAns);
  const delType = useMutation(api.answers.delAnsType)

  const qData = qId
    ? (useQuery(api.admin.getAns, { qId: qId as Id<"Questions"> }) as
        | ResponseData
        | undefined)
    : null;

  const origData = qData
    ? {
        topic: { id: qData[1]?.topic[0]._id, title: qData[1]?.topic[0].topic },
        question: { id: qId as string, title: qData[2].qTitle },

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
      }
    : null;

  const [editInput, setEditInput] = useState(qId !== null ? true : false);
  const [editMode, setEditMode] = useState(qId !== null ? true : false);
  //editInput set true disables all inputs. I referred to editInput as editInput mode so initially all should be disabled={true}
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: { title: "", id: "" },

      question: { id: "", title: "" },
      surah: "",
      answers: [{ types: [{ text: "", type: "", reference: "", id: "" }] }],
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

  async function onSubmit(values: z.infer<typeof formSchema>,  e: React.BaseSyntheticEvent
  ) {
    const data: {
      topic?: { id?: string; title?: string };
      surah?: string;
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
    const button = e.nativeEvent?.submitter;
    const action = button?.value;
    if (qData && origData && editMode) {
      if (
        values.topic.id !== origData.topic.id ||
        values.topic.title !== origData.topic.title
      ) {
        data.topic = values.topic;
      } else {
        data.topic = values.topic;
      }

      if (
        values.question.id !== origData.question.id ||
        values.question.title !== origData.question.title
      ) {
        data.question = values.question;
      } else {
        data.question = values.question;
      }
      
      if (values.surah !== origData.surah) {
        data.surah = values.surah;
      }
      
        const changedAnswers = values.answers.flatMap((ans, i:number) => {
          
          const ansId = ans.id
          const origAns = origData.answers.filter((ans)=> ans.id === ansId) 
          // Completely new answer (index doesn't exist in original)
          if (origAns?.length === 0) {
            console.log("empty arr", ans)
            return [{ ...ans }]; // full answer including types
          }
        
          // Check for changed or new types
          const changedTypes = ans.types
            .map((t, j) => {
              const origT = origAns[0].types[j];
              if (
                !origT ||
                t.type !== origT.type ||
                t.text !== origT.text ||
                t.reference !== origT.reference
              ) {
                return t;
              }
              return undefined;
            })
            .filter((t): t is typeof t => t !== undefined); // type guard
        
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
    await onCreate(editMode ? data : values);
    if(action==="upload"){
      await upload({topicId:values.topic.id as Id<"Topics">, qId:values.question.id as Id<"Questions">,
        ansId:answers[0].id as Id<"Answers">
      })
    }
  }
  const topics = useQuery(api.topics.get);
  const questions = useQuery(api.questions.get, { status: "approved" });
  const surahs = useQuery(api.surahs.get);
  const types = useQuery(api.types.get);

  useEffect(() => {
    const Qexist = questions?.find((q) => q._id == origData?.question.id);
    if (editMode && !Qexist) {
      questions?.push({
        _id: origData?.question.id as Id<"Questions">,
        title: origData?.question.title as string,
      });
    }
  }, [questions]);

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
    <div className="w-full font-sans h-full flex flex-col flex-1 text-sm pb-4 justify-center items-center overflow-hidden">
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
              onRemoveAnswer={() => deleteAns(answerIndex)}
              onRemoveType = {deleteAnsType}
              types={types}
              findLabel={findLabel}
              editInput={editInput}
              editMode={editMode}
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
                {editInput ? "editInput" : "editInputing.."}
              </Button>
              <Button type="submit"  >Save</Button>
              <Button type="submit" value="upload">Upload</Button>
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
