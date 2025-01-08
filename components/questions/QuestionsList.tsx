"use client";
import React, {useState} from "react";
import {Search, Code} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import QuestionCard from "./QuestionCard";
// import InterestBtn from "@/app/components/InterestBtn";
// import IdeaCard from "@/app/components/IdeaCard";

function QuestionsList({
  qArr,
}: {
  qArr: (Doc<"Questions">[]) }
) {
  const [search, setSearch] = useState("");
  let filter = "all";

  const filteredQues =
    search !== ""
      ? qArr.filter((idea) =>
          idea.title.toLowerCase().includes(search.toLowerCase())
        )
      : qArr;

  return (
    <div>
      <div className="flex gap-4 mb-10">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
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
      <div className="grid md:grid-cols-1   md:auto-cols-max gap-6 w-full  justify-center md:justify-normal items-center pb-4  ">
        {filteredQues.length !== 0
          ? filteredQues.map((q, i: number) => (
              <QuestionCard
                key={q._creationTime}
                id={q._id}

                title={q.title}
               
                
              />
            ))
          : null}
      </div>
    </div>
  );
}

export default QuestionsList;
