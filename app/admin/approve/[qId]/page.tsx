"use client";
import AcceptReject from "@/app/answers/AcceptReject";
import AnswerSec from "@/components/answers/AnswerSec";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";

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
}

type ResponseData = [Answer[], { topic: Topic[] }, Question];

function Answers() {
  const { qId } = useParams<{ qId: Id<"Questions"> }>();
  const answers = useQuery(api.admin.getAns, { qId }) as ResponseData | undefined;

  // If answers are still loading or undefined, show loading message
  if (!answers) {
    return <span>No answers yet</span>;
  }

  // Extract data safely
  const questionTitle = answers[2]?.qTitle ?? "No title available";
  const topicTitle = answers[1]?.topic?.[0]?.topic ?? "No topic available";
  const topicId = answers[1]?.topic?.[0]?._id;
  
  return (
    <div className="w-full h-[100%] gap-4 flex flex-col mx-auto pt-8 relative overflow-auto">
      <h1 className="text-center text-2xl md:text-3xl text-dark tracking-wider border-[1px] rounded-sm bg-accent py-4  z-10">
        {questionTitle}
      </h1>
      <h1 className="text-center text-2xl md:text-3xl text-dark tracking-wider border-[1px] rounded-sm bg-accent py-4  z-10">
        {topicTitle}
      </h1>

<div className="space-y-2">

      {answers[0]?.length > 0 ? (
        answers[0].map((a) => {
          const typeIds = [...new Set(a?.type.map(t => t.type_id) ?? [])];
          return (
          <div key={a._creationTime} className="space-y-2 border-[2px] rounded-xl ">
            
              <>
                <AnswerSec key={a._creationTime} ans={a} />
                {(topicId && typeIds) && <AcceptReject ansId={a._id} qId={qId} topicId={topicId} typeIds={typeIds} />}
              </>
            
            
          </div>
        )})
      ) : (
        <span>No answers available.</span>
      )}
</div>
    </div>
  );
}

export default Answers;
