import AnswerSec from "@/components/answers/AnswerSec";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//if more than 1 answer, show as a dropdown.

async function Answers({ params }: { params: Promise<{ qId: string }> }) {
  const slug = (await params).qId;
  const qId = slug as Id<"Questions">;
  const answers = await fetchQuery(api.answers.get, { qId });
  const question = await fetchQuery(api.questions.getById, { qId });
  
  if (answers?.length == 0) {
    return <span>No answers yet</span>;
  }

  return (
    <div className="w-full h-full flex flex-col py-6 overflow-hidden">
    {/* Title - Always Visible */}
    <div className="min-h-[80px] flex ">

    <h1 className="text-center text-2xl md:text-3xl text-dark tracking-wider 
         rounded-sm bg-accent py-4  h-[60px] flex mx-auto ">
      {question?.title}
    </h1>
    </div>
  
    {/* Tabs Container - Takes Full Space But Doesn't Shrink */}
    <Tabs defaultValue={answers[0]._id} className="  w-full flex flex-col h-fit overflow-hidden ">
      
      {/* Tab Triggers - FIXED Below Title */}
      <TabsList className="w-full  ">
        {answers?.map((a, i) => (
          <TabsTrigger
            key={a._id}
            className="data-[state=active]:bg-primaryLight data-[state=active]:text-primary  text-lg w-full"
            value={a._id}
          >
            Ans {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* SCROLLABLE Tab Content */}
      <div className="  flex max-h-[80%] mt-4 overflow-hidden">
        {answers?.map((a) => (
          <TabsContent 
          value={a._id} 
          className="px-2 pb-8 sm:px-0 w-full h-full"
        >
          <AnswerSec key={a._creationTime} ans={a} />
        </TabsContent>
        ))}
      </div>
  
    </Tabs>
  </div>
  


  );
}

export default Answers;
