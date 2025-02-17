"use client";
import React, {useState} from "react";
import {Search, Code} from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import QuestionCard from "./QuestionCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/lib/useStore";
// import InterestBtn from "@/app/components/InterestBtn";
// import IdeaCard from "@/app/components/IdeaCard";

function QuestionsList({
  topicId,
}: {
  topicId: Id<"Topics"> }
) {
  console.log(topicId,"topicId")
  const [search, setSearch] = useState("");
  const [showIndex, setShowIndex]=useState<null|number>(0)
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

    
const onOpenToggle=(i:number|null)=>setShowIndex(i)

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
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              filter === "project"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
            //  onClick={() => setFilter("project")}
          >
            <Code size={20} />
            Projects
          </button>
        </div> */}
      </div>

      {/* rows messed up with header, cols does not.  */}
      <div className="grid md:grid-cols-1   md:auto-cols-max gap-6 w-full  md:justify-normal items-center pb-4  ">
        {filteredQues?.length !== 0
          ? filteredQues?.map((q, i: number) => (
            <>
            <QuestionCard
                key={q._creationTime}
                id={q._id}
                showIndex={showIndex}
                title={q.title}
                ans={q.ans[0]}
                setShowIndex={setShowIndex}  
                index={i}
                />
           
                </>
            ))
          : null}
      </div>
    </div>
  );
}

export default QuestionsList;
