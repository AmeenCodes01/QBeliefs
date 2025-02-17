"use client"
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { AnsProps } from "@/types";

function AnswerSec({ ans }: AnsProps) {
    const [readMore, setReadMore]=useState(false)
    
    const types = readMore ? ans.type : ans.type.slice(0,2)
  return (
    <Card className="w-full justify-start flex flex-col font-serif ">
      <CardHeader>
        <CardTitle className="text-right text-2xl"> {ans.title}</CardTitle>
        {/* <CardDescription>
            Deploy your new project in one-click.
          </CardDescription> */}
      </CardHeader>
      <CardContent>
      <div
          className={`transition-all duration-700 ease-in overflow-hidden ${
            readMore ? "max-h-[1000px]" : "max-h-[200px]"
          }`}
        >
        {types.map((type) => (
          <div key={type._creationTime} className="ml-auto w-fit" id={type.typeWithName.name}>
            <h1
              className="font-black
            my-2
             self-start w-fit ml-auto
            underline
          "
            >
              {type.typeWithName.name}
            </h1>
            <p
              className=" self-start w-fit ml-auto  
            items-start leading-9 tracking-widest flex text-right
            text-xl font-extralight
            "
            >
              {type.content}
            </p>
            <span className="text-md pt-2 text-accent-foreground opacity-80 text-left">
              {type.reference}
            </span>
          </div>
        ))}

        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="justify-center flex" onClick={()=> setReadMore(prev=>!prev)}>Show {readMore ?"less ":"more"} {readMore? <Minus/>:<Plus/>} </Button>
      </CardFooter>
    </Card>
  );
}

export default AnswerSec;
