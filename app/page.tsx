import { api } from "@/convex/_generated/api";
import React from "react";
import { fetchQuery } from "convex/nextjs";
import QuestionsList from "@/components/questions/QuestionsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/surahs/sidebar";
async function page() {
  const topics = await fetchQuery(api.topics.get);
  return (
    <div className="w-full  h-full flex mx-auto min-h-0 md:p-4 p-2 ">
    <Tabs defaultValue={topics[0].topic} className="w-full flex flex-col h-full gap-2 ">
    
      <TabsList className="w-full sticky top-0 z-10 bg-primary text-white md:rounded-sm md:flex overflow-x-auto h-fit md:gap-5 gap-2 grid grid-cols-2 rounded-md  md:flex-row-reverse justify-start text-xl">
        {topics.map((topic) => (
          <TabsTrigger value={topic.topic} className=" text-xl md:text-2xl" key={topic._id}>
            {topic.topic}
          </TabsTrigger>
        ))}
      </TabsList>
  
     
      <div className="flex md:flex-row flex-col-reverse w-full flex-1 bg-white overflow-hidden">
       
        <div className="md:w-[80%] h-[95%] w-full md:h-full flex-1">
          {topics.map((topic) => (
            <TabsContent
              value={topic.topic}
              className="h-full flex-1 w-full overflow-auto py-4 px-2 rounded-sm scrollbar-left"
              key={topic._id}
            >
              <QuestionsList topicId={topic._id} />
            </TabsContent>
          ))}
        </div>
  
       
        <div className=" md:w-[20%]  md:h-full h-[5%] md:pl-4 overflow-auto bg-white flex md:block">
          <Sidebar />
        </div>
      </div>
    </Tabs>
  </div>
  
  );
}

export default page;
