import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { SignIn } from "./auth/SignIn";

function page() {
  console.log("hi")
  return (
    <div className="w-full h-full bg-gray-500 gap-2 flex flex-1">
      
      <Link href="/admin/create">
        <Button>Create</Button>
      </Link>
      <Link href="/admin/manage">
        <Button>Manage</Button>
      </Link>
    </div>
  );
}

export default page;
