import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { SignOut } from "./components/SignOut";

function page() {
  console.log("hi")
  return (
    <div className="w-full h-full justify-center items-center gap-8 flex flex-col">
      <div className="flex flex-col items-center w-full gap-4">
      <Link href="/admin/create">
        <Button className="w-[300px]">Create</Button>
      </Link>
      <Link href="/admin/manage">
        <Button className="w-[300px]">Manage</Button>

      </Link>

      </div>

      <SignOut/>
     
    </div>
  );
}

export default page;
