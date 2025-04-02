"use client"
import React, { useEffect, useState,useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { AnsProps } from "@/types";


function AnswerSec({ ans }: AnsProps) {
    const [readMore, setReadMore]=useState(true)
    const types = readMore ? ans.type : ans.type.slice(0,2)
  

   
    
  return (
    <Card 
    className="w-full bg-white h-full overflow-auto justify-start flex flex-col scrollbar-left"
  >    <CardHeader className="">
      
      {/* <CardDescription>
          Deploy your new project in one-click.
        </CardDescription> */}
    </CardHeader>
    <CardContent>
    <div
        className={` transition-all duration-700 ease-in   `}
      >
      {ans?.type?.map((type) => {
        return(
        <div key={type._creationTime} className=" h-fit   transition-all  w-full p-4 rounded-md text-black text-right " id={type?.typeWithName?.name}>
          <h1
            className="  w-full
          my-2
           self-start text-right  ml-auto
          underline  md:text-2xl text-xl underline-offset-2
        "
          >
            {type?.typeWithName?.name}
          </h1>
          <p
            className=" self-start w-fit ml-auto  
          items-start leading-9 tracking-widest flex text-right
          md:text-2xl text-xl font-extralight text-grayDark
          "
          >
            {type.content}
          </p>
          <span className="text-lg pt-2 text-accent-foreground opacity-80 text-left w-full mr-auto">
           ( {type.reference} ) 
          </span>
        </div>
      )})}

      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      {/* <Button className="justify-center flex" onClick={()=> setReadMore(prev=>!prev)}>Show {readMore ?"less ":"more"} {readMore? <Minus/>:<Plus/>} </Button> */}
    </CardFooter>
  </Card>
  );
}

export default AnswerSec;
