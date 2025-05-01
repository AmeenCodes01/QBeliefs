"use client";
import React, {useState} from "react";
import {Search, Code} from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import QuestionCard from "./QuestionCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/lib/useStore";

function QuestionsList({
  topicId,
  search
}: {
  topicId: Id<"Topics">, search:string }
) {

  const [showIndex, setShowIndex]=useState<null|number>(0)
  console.log(showIndex,"showIndes")
  let filter = "all";
  const surahId = useStore(state=>state.surahId)
  const qArr = useQuery(api.questions.getByTopic,{topicId})

  const searchQues =  useQuery(api.questions.getBySearch,{query:search!=="" ?search:"skip"})
  const surahFilteredQues = qArr?.filter((ques) => {
    let surahMatch = true;
    let searchMatch = true;
  
    if (surahId) {
      surahMatch = ques.surahIds.includes(surahId);
    }
  
    if (search !== "") {
      searchMatch = ques.title.toLowerCase().includes(search.toLowerCase());
    }
  
    return surahMatch && searchMatch;
  })
  
  

const displayQues = search !=="" ? searchQues : surahFilteredQues
  return (
    <div className="flex overflow-auto flex-col w-full ">
    

      {/* rows messed up with header, cols does not.  */}
      <div className="grid md:grid-cols-1   md:auto-cols-max gap-6 w-full  md:justify-normal items-center pb-4  ">
        {displayQues?.length !== 0
          ? displayQues?.map((q, i: number) => (
            
            <QuestionCard
                key={q._creationTime}
                id={q._id}
                showIndex={showIndex}
                title={q.title}
                ans={q.ans[0]}
                setShowIndex={setShowIndex}  
                index={i}
                />
           
                
            ))
          : <>
          <span className="text-2xl text-gray-400">No Questions added yet</span>
          </>}
      </div>
    </div>
  );
}

export default QuestionsList;
