"use client"
import React, { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/surahs/sidebar";
import { Doc } from '@/convex/_generated/dataModel';
import QuestionsList from './questions/QuestionsList';
import { useStore } from '@/lib/useStore';
import { Search } from 'lucide-react';

function TopicTabsSidebar({topics}:{topics:Doc<"Topics">[]}) {
      const setSurah = useStore((state) => state.setSurahId);
        const [search, setSearch] = useState("");
      
    
  return (
    <div className='flex flex-col w-full h-full'>
      <div className="flex gap-4 mb-3">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2  -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search questions..."
            className="w-full bg-white pl-10 rtl pr-4 py-2 border text-right  rounded-lg focus:outline-none "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
       
      </div>
    <Tabs defaultValue={topics[0].topic} className="w-full flex flex-col h-full gap-2 "
    onValueChange={(value)=> setSurah(null)}
    >
    
      <TabsList className="w-full sticky
      
      scrollbar-left
      
      top-0 z-10 bg-primary text-white md:rounded-sm md:flex overflow-x-auto h-fit md:gap-5 gap-2 grid grid-cols-2 rounded-md  md:flex-row-reverse justify-start text-xl">
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
              <QuestionsList topicId={topic._id} search={search}/>
            </TabsContent>   
          ))}
        </div>
  
       
        <div className=" md:w-[20%]  md:h-full h-[5%] md:pl-4 overflow-auto bg-white flex md:block">
          <Sidebar />
        </div>
      </div>
    </Tabs>
    </div>
  )
}

export default TopicTabsSidebar
