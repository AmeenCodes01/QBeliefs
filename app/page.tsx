import { api } from "@/convex/_generated/api";
import React from "react";
import { fetchQuery } from "convex/nextjs";
import QuestionsList from "@/components/questions/QuestionsList";
import { ThemeToggle } from "@/components/ThemeToggle";

async function page() {
  const questions = await fetchQuery(api.questions.get);
  console.log(questions);
  return (
    <div className=" w-full h-[100%] flex flex-col  mx-auto pt-10   ">
      {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6"></div> */}
      <QuestionsList qArr={questions} />
      <ThemeToggle />
    </div>
  );
}

export default page;
