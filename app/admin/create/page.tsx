"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  
  FormField
  
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ItemForm from "../components/ItemForm";
import { Doc, Id } from "@/convex/_generated/dataModel";
import DataList from "../components/DataList";
import AnswerItem from "../components/AnswerItem";

const formSchema = z.object({
  topic: z.string({}).min(1, { message: "Please select a topic." }),
  question: z.string({}).min(1, { message: "Please select a topic." }),
  answers: z.array(
    z.object({
      types: z.array(
        z.object({
          type: z.string().min(1, { message: "Please select a type." }),
          text: z
            .string()
            .min(1, { message: "Please provide text for the type." }),
          reference: z.string().optional(),
        }),
      ),
    }),
  ),
  surah: z.string({}).min(1, { message: "Please select a topic." }),
});

export default function ProfileForm() {
  const onCreate = useMutation(api.admin.create);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      question: "",
      surah: "",
      answers: [{ types: [{ text: "", type: "", reference: "" }] }],
    },
  });

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedValues = {
      ...values,
      surah: values.surah as Id<"Surahs">,
    };
    console.log(updatedValues);
    onCreate(updatedValues);
  }

  const topics = useQuery(api.topics.get);
  const questions = useQuery(api.questions.get, { status: "approved" });
  const surahs = useQuery(api.surahs.get);
  const types = useQuery(api.types.get);

  console.log("render");

  return (
    <div className="w-full h-full flex flex-col flex-1 text-md pb-4 justify-center items-center overflow-hidden">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col h-[98%] w-full overflow-auto p-2"
        >
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <ItemForm
                field={field}
                label="Topic"
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
            )}
          />
          <FormField
            control={form.control}
            name="surah"
            render={({ field }) => (
              <ItemForm
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
                field={field}
                label="Question"
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
    onRemoveAnswer={() => removeAnswer(answerIndex)}
    types={types}
  />
))}

          <Button
            type="button"
            onClick={() =>
              appendAnswer({ types: [{ text: "", type: "", reference: "" }] })
            }
          >
            Add Answer
          </Button>

          {/* Add Answer button */}
          <Button
            type="button"
            className="w-fit text-white ml-auto"
            onClick={() =>
              appendAnswer({ types: [{ type: "", text: "", reference: "" }] })
            }
          >
            + Add Answer
          </Button>

          {/* Submit button */}
          <Button
            className="w-[400px] ml-auto mr-auto text-lg text-white"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
