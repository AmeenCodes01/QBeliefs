import React from 'react'
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from '@/convex/_generated/api';
import QuestionCard from '@/components/questions/QuestionCard';
import { Id } from '@/convex/_generated/dataModel';
import { Doc } from '@convex-dev/auth/server';

async function page() {
  const waiting = (await fetchQuery(api.admin.getWaiting)) || [];

    console.log(waiting,"uniqueWaiting")
  return (
    <div className="flex overflow-auto flex-col w-full pt-6 ">
       <div className="grid md:grid-cols-1   md:auto-cols-max gap-6 w-full  md:justify-normal items-center pb-4  ">
        {waiting?.length !== 0
          ? waiting?.map((q, i: number) => (
            
            <QuestionCard
                key={q?._creationTime}
                id={q?._id as Id<"Questions">}
               index={i}
                title={q?.title as string}
                style={"border-[1px] "}
                href={"approve"}
                />
           
            
            ))
          : null}
      </div>
    </div>
  )
}

export default page
