
import AnswerSec from '@/components/answers/AnswerSec';
import { CardTitle } from '@/components/ui/card';
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { fetchQuery } from 'convex/nextjs';
import React from 'react'
// import { useRouter } from 'next/navigation'


async  function Answers({params}:{params:{qId:string;}}) {
    console.log(params.qId,"params")
    const qId = params.qId as Id<"Questions">
    const answers = await fetchQuery(api.answers.get,{qId })
    const question = await fetchQuery(api.questions.getById,{qId})
   
    if (answers.length==0){
      return (
        <span>No answers yet</span>
      )
    }
  return (
    <div className="w-full h-[100%] gap-4 flex flex-col mx-auto pt-8 relative">
  <h1 className="text-center text-2xl tracking-wider border-[1px] rounded-sm bg-accent py-4 sticky top-0 z-10">
    {question?.title}
  </h1>
  {answers.map((a) => (
    <AnswerSec key={a._creationTime} ans={a} />
  ))}
</div>
  )
}

export default Answers