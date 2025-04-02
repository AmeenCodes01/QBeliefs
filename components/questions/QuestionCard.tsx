"use client";
type Props = {
  title: string;
  id: Id<"Questions">;
  style?: string;
  index: number;
  ans?: AnswerType;
  setShowIndex?: React.Dispatch<React.SetStateAction<number | null>>;
  showIndex?: number | null;
  href?: string;
};

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { AnsProps, AnswerType } from "@/types";
import { useQuery } from "convex/react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function QuestionCard({
  title,
  id,
  style,
  index,
  ans,
  setShowIndex,
  showIndex,
  href,
}: Props) {

  const [selectedType, setSelectedType] = useState("مختصر جواب");
  const types = useQuery(api.types.get);

  const iconStyle =
    "bg-primary rounded-full  self-center my-auto mr-auto transition-transform duration-300";

  console.log(index, "index");

  const content = ans?.type?.filter(
    (t) => t?.typeWithName?.name === selectedType,
  );
  return (
    <div className="flex h-[100%] flex-col">
      <Card
        className={
          "rounded-sm hover:cursor-pointer h-full text-right flex flex-col font-light shadow-none justify-center " +
          style
        }
      >
        <div>
          {href ? (
            <Link href={{pathname:`${href}`,
            query:{qId: id}
          
          }}
              
            >
              <CardHeader
                className="mt-0 flex flex-row-reverse"
                // onClick={() =>
                //   setShowIndex && index
                //     ? setShowIndex((prev) => {
                //         console.log(prev, index, " prev index");
                //         prev === index ? null : index;
                //       })
                //     : null
                // }
              >
                <CardTitle className="flex-row-reverse gap-2 flex font-normal text-xl md:text-2xl">
                  <div className="flex self-center items-center justify-center w-[18px] h-[18px] rounded-full text-xs text-white bg-primary">
                    {index}
                  </div>
                  <span className="flex gap-[2px] text-primary">
                    <span>:</span> سوال
                  </span>
                  <div className="flex text-dark">{title} </div>
                </CardTitle>
                {/* {ans && <button  className="p-2 mr-auto">
              <ChevronDown
                className={`transition-transform duration-300  ${showIndex===index ? "rotate-180" : "rotate-0"} ${iconStyle}`}
                size={16}
                color="white"
              />
            </button>} */}
              </CardHeader>
            </Link>
          ) : (
            <CardHeader
              className="mt-0 flex flex-row-reverse"
              onClick={() => setShowIndex && 
                setShowIndex((prev) => (prev !== index ? index : null))
                  
              }
            >
              <CardTitle className="flex-row-reverse gap-2 flex font-normal text-xl md:text-2xl">
                <div className="flex self-center items-center justify-center w-[18px] h-[18px] rounded-full text-xs text-white bg-primary">
                  {index}
                </div>
                <span className="flex gap-[2px] text-primary">
                  <span>:</span> سوال
                </span>
                <div className="flex text-dark">{title} </div>
              </CardTitle>
              {ans && (
                <button className="p-2 mr-auto">
                  <ChevronDown
                    className={`transition-transform duration-300  ${showIndex === index ? "rotate-180" : "rotate-0"} ${iconStyle}`}
                    size={16}
                    color="white"
                  />
                </button>
              )}
            </CardHeader>
          )}

          {/* Transition for expanding content */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showIndex == index
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {ans ? (
              <CardContent className="gap-2 text-lg flex flex-col w-full h-auto">
                <div className="w-full p-2 bg-secondaryLight rounded-sm py-1 md:text-lg text-md flex flex-row-reverse gap-2 md:gap-4">
                  {types?.map((t, i) => (
                    <div
                      onClick={() => setSelectedType(t.name)}
                      className={`${
                        selectedType == t.name ? "underline" : ""
                      } flex md:gap-4 gap-1 underline-offset-2 text-grayDark justify-center items-center active:underline`}
                      key={i}
                    >
                      <span className="focus:underline underline-grayDark">
                        {t.name}
                      </span>
                      {i !== 0 ? (
                        <div className="rounded-full size-[4px] bg-grayDark"></div>
                      ) : null}
                    </div>
                  ))}
                </div>

                {/* Dynamic Height Content */}
                <Link href={`answers/${id}#${selectedType}`}>
                  <div className="bg-hover w-full p-4 rounded-sm text-grayMid text-right text-lg">
                    <span className="leading-8 block">
                      {content && content[0]?.content}
                    </span>
                    <span className="text-dark underline-offset-auto underline px-2">
                      دیکھیے تفصیل مفسرین کی زبانی
                    </span>
                  </div>
                </Link>
              </CardContent>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default QuestionCard;
