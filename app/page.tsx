import { api } from "@/convex/_generated/api";
import React from "react";
import { fetchQuery } from "convex/nextjs";
import QuestionsList from "@/components/questions/QuestionsList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/surahs/sidebar";
async function page() {
  const topics = await fetchQuery(api.topics.get);
  return (
    <div className=" w-full h-full flex flex-row  mx-auto min-h-0   px-4 py-4 ">
      <Tabs defaultValue={topics[0].topic} className="w-[85%] overflow-auto scrollbar-left ">
        <TabsList className="w-full  items-start overflow-x-auto h-fit gap-5 flex flex-row-reverse justify-start  text-xl  bg-primary text-white rounded-md ">
          {topics.map((topic) => (
            <TabsTrigger value={topic.topic} className="text-2xl" key={topic._id}>
              {topic.topic}
            </TabsTrigger>
          ))}
        </TabsList>
       
        {topics.map((topic) => (
          <TabsContent value={topic.topic} className="flex-1  overflow-auto bg-white py-4 px-2 rounded-sm"  key={topic._id}>
            <QuestionsList topicId={topic._id} />

            {/* map over the topics and the quesArr in here but with ques. first, model some data with topics type.  */}
          </TabsContent>
        ))}

        
      </Tabs>
      <div className="hidden md:block w-[15%] h-full pl-4 overflow-y-auto flex-1 bg-white ">
  <Sidebar />
</div>
      {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6"></div> */}
    </div>
  );
}

export default page;
