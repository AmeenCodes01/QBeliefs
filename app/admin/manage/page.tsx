"use client"
import React from 'react'
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from '@/convex/_generated/api';
import QuestionCard from '@/components/questions/QuestionCard';
import { Id } from '@/convex/_generated/dataModel';
import { Doc } from '@convex-dev/auth/server';
import { useQuery } from 'convex/react';

 function page() {
  const waiting = useQuery(api.admin.getWaitingQues) || [];

    console.log(waiting,"uniqueWaiting")
  return (
    <div className="flex overflow-auto flex-col w-full pt-6 ">
       <div className="grid md:grid-cols-1   md:auto-cols-max gap-6 w-full  md:justify-normal items-center pb-4  ">
        {waiting?.length !== 0
          ? waiting?.map((q, i: number) => (
            
            <QuestionCard
                key={q?.question._creationTime}
                id={q?.question._id as Id<"Questions">}
               index={i}
                title={q?.question.title as string}
                style={"border-[1px] "}
                href={"create"}
                />
           
            
            ))
          : null}
      </div>
    </div>
  )
}

export default page
