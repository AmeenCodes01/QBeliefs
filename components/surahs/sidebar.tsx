"use client";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/lib/useStore";
import { useQuery } from "convex/react";
import { Cross, X } from "lucide-react";
import React from "react";

function Sidebar() {
  const surahs = useQuery(api.surahs.get);
  const setSurah = useStore(state=>state.setSurahId)
  const surahId = useStore(state=>state.surahId)
  
  return (
    <div className="h-full w-full gap-1 flex flex-col overflow-y-auto scrollbar-left flex-1 hover:cursor-pointer">
      {surahId && <div className="flex flex-row  items-center  border-[1px] bg-primaryLight border-dark w-fit mr-auto p-1 focus:cursor-pointer" onClick={()=>setSurah(null)}>
        <X size={12} className="mt-auto mb-auto   "  />
        </div>}
  {surahs?.map((su) => (
    <div className={`flex-row-reverse gap-5 p-3 active:border-[1px] rounded-md flex font-normal text-2xl ${surahId==su._id ?" border-[1px] bg-primaryLight border-primary":""}`} key={su._id}
    onClick={()=>setSurah(su._id)}
    >
      <div className="flex self-center items-center justify-center w-[18px] h-[18px] rounded-full text-xs text-white bg-primary">
        {su.surah}
      </div>
      <div className="flex text-dark">{su.name}</div>
    </div>
  ))}
</div>
  );
}

export default Sidebar;
