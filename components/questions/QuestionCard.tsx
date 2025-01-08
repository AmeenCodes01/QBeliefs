type Props = {
    title: string;
    id: Id<"Questions">;
   style?:string;
  };

  import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
  
  function QuestionCard({
    title,
   id,
    style
  }: Props) {
    //a profile page for name + year.
  
    return (
      <div className="flex h-[100%] flex-col " >
        <Link href={`/answers/${id}`}>
          <Card 
        
          className={" rounded-sm  hover:cursor-pointer h-full   shadow-sm hover:shadow-inner flex flex-col "+style}>
        
              <div>
                <CardHeader className="mt-0">
                  <CardTitle className="font-cinzel text-xl font-semibold justify-end flex  ">
                    {title}
                  </CardTitle>
                  <CardDescription className="text-xs ">
                    <span>
                    </span>
  
                    {/* <span>{shortDesc}</span> */}
                  </CardDescription>
                </CardHeader>
                {/* <CardContent className="flex gap-4 flex-col">
                  <p className="text-sm font-medium text-ellipsis overflow-hidden">
                    {shortDesc}
                  </p>
                  <div className="flex md:flex-row-reverse flex-col gap-4 md:gap-0 justify-between w-full   ">
                    <div className="flex flex-col">
                      <span className="text-xs  font-[400] pb-[4px]  ">
                        Seeking teammates eager to contribute or learn in:
                        <br />
                      </span>
                      <span className="text-sm font-extralight italic">
                        {lookingFor}
                      </span>
                    </div>
  
                    <div className="flex flex-col">
                      <span className="text-xs font-[500] pb-[4px]  ">
                        {" "}
                        Collab:
                      </span>
                      <span className="text-sm font-extralight italic md:self-end mt-auto">
                        {" "}
                        {meetingFormat}
                      </span>
                    </div>
                  </div>
                </CardContent> */}
              </div>
            
            {/* <CardFooter className="flex md:flex-row flex-col gap-2  justify-between">
              <div className="flex gap-2">{btn && btn}</div>
              <div className="mt-auto ">
                <span className=" text-xs italic self-end mt-auto">
                  Click for more details
                </span>
              </div>
            </CardFooter> */}
                      </Card>
        </Link>
      </div>
    );
  }
  
  export default QuestionCard;
  