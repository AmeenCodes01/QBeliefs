import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
 
export function SignIn() {
  const { signIn } = useAuthActions();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        void signIn("password", formData);
      }}
    >
      <div className="flex flex-col gap-2 ">

      <Input name="email" placeholder="Email" type="text" />
      <Input name="password" placeholder="Password" type="password" />
      <input name="flow" type="hidden" value={"signIn"} />
      </div>
      <Button type="submit" className="text-white bg-dark font-serif mt-4 w-full">Sign In</Button>
    
    </form>
  );
}