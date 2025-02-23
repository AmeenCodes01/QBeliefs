import React from 'react'
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from '@/convex/_generated/api';
import QuestionCard from '@/components/questions/QuestionCard';

async function page() {
    const ques = await fetchQuery(api.questions.get,{status:"waiting"})
  return (
    <div className="flex overflow-auto flex-col w-full pt-6 ">
       <div className="grid md:grid-cols-1   md:auto-cols-max gap-6 w-full  md:justify-normal items-center pb-4  ">
        {ques?.length !== 0
          ? ques?.map((q, i: number) => (
            <>
            <QuestionCard
                key={q._creationTime}
                id={q._id}
               index={i}
                title={q.title}
                style={"border-[1px] "}
                href={"approve"}
                />
           
                </>
            ))
          : null}
      </div>
    </div>
  )
}

export default page
