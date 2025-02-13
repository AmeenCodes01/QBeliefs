type Props = {
  title: string;
  id: Id<"Questions">;
  style?: string;
  index: number;
  ans: AnswerType
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
import { ArrowUp, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function QuestionCard({ title, id, style, index, ans }: Props) {
  
  const typeNames = ans.type.map(type=> type.typeWithName.name)
  const [show, setShow] = useState(false);



  const [selectedType, setSelectedType] = useState("مختصر جواب");
  const types = useQuery(api.types.get);

  const iconStyle =
    "bg-primary rounded-full self-center my-auto mr-auto transition-transform duration-300";
  
  const content =                   ans.type.filter((t)=> t.typeWithName.name === selectedType)
  console.log(content,"c")
  return (
    <div className="flex h-[100%] flex-col">
      <Card
        className={
          "rounded-sm hover:cursor-pointer h-full  flex flex-col font-light shadow-none" +
          style
        }
      >
        <div>
          <CardHeader className="mt-0 flex flex-row-reverse justify-between">
            <CardTitle className="flex-row-reverse gap-2 flex font-normal text-2xl">
              <div className="flex self-center items-center justify-center w-[18px] h-[18px] rounded-full text-xs text-white bg-primary">
                {index}
              </div>
              <span className="flex gap-[2px] text-primary">
                <span>:</span> سوال
              </span>
              <div className="flex text-dark">{title}</div>
            </CardTitle>
            <button onClick={() => setShow(!show)} className="p-2">
              <ChevronDown
                className={`transition-transform duration-300 ${show ? "rotate-180" : "rotate-0"} ${iconStyle}`}
                size={16}
                color="white"
              />
            </button>
          </CardHeader>

          {/* Transition for expanding content */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              show ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <CardContent className="gap-2 text-lg flex flex-col">
              <div className="w-full p-2 bg-secondaryLight rounded-sm py-1 text-lg flex flex-row-reverse gap-4">
                {types?.map((t, i) => (
                  <div
                  onClick={()=>setSelectedType(t.name)}
                    className={` ${selectedType == t.name?"underline":""} flex gap-4 underline-offset-2 text-grayDark justify-center items-center active:underline `}
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
              <div className="bg-hover p-4 rounded-sm text-grayMid text-right text-lg">
                <span className="leading-8">
                  {content[0]?.content}
                </span>
                <span className="text-dark underline-offset-auto underline">
                  دیکھیے تفصیل مفسرین کی زبانی
                </span>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default QuestionCard;
