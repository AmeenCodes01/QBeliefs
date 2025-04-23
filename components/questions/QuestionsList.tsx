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
}: {
  topicId: Id<"Topics"> }
) {
  const [search, setSearch] = useState("");
  const [showIndex, setShowIndex]=useState<null|number>(0)
  console.log(showIndex,"showIndes")
  let filter = "all";
  const surahId = useStore(state=>state.surahId)
  const qArr = useQuery(api.questions.getByTopic,{topicId})

  const filteredQues = qArr?.filter((ques) => {
    let surahMatch = true;
    let searchMatch = true;
  
    if (surahId) {
      surahMatch = ques.surahIds.includes(surahId);
    }
  
    if (search !== "") {
      searchMatch = ques.title.toLowerCase().includes(search.toLowerCase());
    }
  
    return surahMatch && searchMatch;
  });

console.log(qArr,"qArr")
  return (
    <div className="flex overflow-auto flex-col w-full ">
      <div className="flex gap-4 mb-10">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full bg-white pl-10 pr-4 py-2 border rounded-lg focus:outline-none "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
       
      </div>

      {/* rows messed up with header, cols does not.  */}
      <div className="grid md:grid-cols-1 border-2  md:auto-cols-max gap-6 w-full  md:justify-normal items-center pb-4  ">
        {filteredQues?.length !== 0
          ? filteredQues?.map((q, i: number) => (
            
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
          : null}
      </div>
    </div>
  );
}

export default QuestionsList;
