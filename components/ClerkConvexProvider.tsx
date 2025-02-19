"use client";

import {ClerkProvider} from "@clerk/nextjs";
import {useAuth} from "@clerk/nextjs";
import { SignInButton } from '@clerk/nextjs'

import { ConvexProviderWithClerk } from "convex/react-clerk";
import {ConvexReactClient} from "convex/react";
import {Authenticated, Unauthenticated} from "convex/react";
import { Button } from "@/components/ui/button";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);
console.log(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,"key")
export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {/* Show AuthScreen for unauthenticated users */}
        
          {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
