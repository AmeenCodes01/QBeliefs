import { api } from "@/convex/_generated/api";
import React from "react";
import { fetchQuery } from "convex/nextjs";
import QuestionsList from "@/components/questions/QuestionsList";
import TopicTabsSidebar from "@/components/TopicTabsSidebar";
async function page() {
  const topics = await fetchQuery(api.topics.get);
  return (
    <div className="w-full  h-full flex mx-auto min-h-0 md:p-4 p-2 ">
   <TopicTabsSidebar topics={topics}/>
  </div>
  
  );
}

export default page;
