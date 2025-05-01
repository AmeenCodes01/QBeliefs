"use client";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/lib/useStore";
import { useQuery } from "convex/react";
import { Cross, SlidersHorizontal, X } from "lucide-react";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ClearFilter from "../ClearFilter";

function Sidebar() {
  const surahs = useQuery(api.surahs.get);
  const setSurah = useStore((state) => state.setSurahId);
  const surahId = useStore((state) => state.surahId);
  
  const selectedSurah = surahs?.filter((su)=> su._id == surahId)[0]

  return (
    <>
      {surahId && (
        <div className="sticky top-0 flex flex-row gap-3">
<span className="text-center my-auto">Surah filter :</span>
          <ClearFilter name={selectedSurah?.name}/>
        </div>
      )}
    <div className="hidden h-full w-full gap-1 md:block flex-col overflow-y-auto overflow-x-hidden scrollbar-left flex-1 hover:cursor-pointer">
      {surahs?.map((su) => (
        <div
          className={`flex-row-reverse gap-3 p-3 active:border-[1px] rounded-md flex font-normal text-2xl ${surahId == su._id ? " border-[1px] bg-primaryLight border-primary" : ""}`}
          key={su._id}
          onClick={() => setSurah(su._id)}
        >
          <div className="flex self-center items-center justify-center w-[18px] h-[18px] rounded-full text-xs text-white bg-primary">
            {su.surah}
          </div>
          <div className="flex text-dark">{su.name}</div>
        </div>
      ))}
    </div>
    <Sheet >
      <div className="md:hidden">

    {surahId && (
      <ClearFilter name={selectedSurah?.name}/>
      )}
      </div>
    <SheetTrigger className="md:hidden flex pr-2 justify-center items-center ml-auto "><SlidersHorizontal size={14} color="#184F46"/></SheetTrigger>
  <SheetContent className="bg-white">
    <SheetHeader className="hidden">
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. 
      </SheetDescription>
    </SheetHeader>
    <div className=" h-full w-full gap-1 md:block flex-col overflow-y-auto overflow-x-hidden scrollbar-left flex-1 hover:cursor-pointer">
      
      {surahs?.map((su) => (
        <div
          className={`flex-row-reverse gap-5 p-3 active:border-[1px] rounded-md flex font-normal text-2xl ${surahId == su._id ? " border-[1px] bg-primaryLight border-primary" : ""}`}
          key={su._id}
          onClick={() => setSurah(su._id)}
        >
          <div className="flex self-center items-center justify-center w-[22px] h-[22px] rounded-full text-xs text-white bg-primary">
            {su.surah}
          </div>
          <div className="flex text-dark">{su.name}</div>
        </div>
      ))}
    </div>
  </SheetContent>
    </Sheet>
      </>
  );
}

export default Sidebar;
