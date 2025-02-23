"use client";
import { Button } from "@/components/ui/button";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import React from "react";
import { SignIn } from "../auth/SignIn";
import { PasswordReset } from "../auth/PasswordReset";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning={true} className="w-full h-full flex">
      <Unauthenticated>
        <div className="w-full flex h-full items-center justify-center bg-primary">
       <SignIn/>
       {/* <PasswordReset/> */}
        </div>
      </Unauthenticated>
      <Authenticated> {children}
      </Authenticated>
    </div>
  );
}

export default Provider;
