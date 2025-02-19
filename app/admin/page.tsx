import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="w-full h-full bg-gray-500 flex flex-1">
      <Link href="/admin/create">
        <Button>Create</Button>
      </Link>
      {/* <Link href="/admin/create">
        <Button>Create</Button>
      </Link> */}
    </div>
  );
}

export default page;
