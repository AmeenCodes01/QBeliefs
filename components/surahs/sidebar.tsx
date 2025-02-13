"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

function Sidebar() {
  const surahs = useQuery(api.surahs.get);
  return (
    <div className="h-full w-full gap-1 flex flex-col overflow-y-auto scrollbar-left flex-1">
  {surahs?.map((su) => (
    <div className="flex-row-reverse gap-5 p-3 active:border-[1px] rounded-md flex font-normal text-2xl">
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
