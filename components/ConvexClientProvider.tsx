"use client";



import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);
export default function Providers({children}: {children: React.ReactNode}) {
  return (
   
      <ConvexAuthNextjsProvider  client={convex} >
        {/* Show AuthScreen for unauthenticated users */}
        
          {children}
      </ConvexAuthNextjsProvider>
  
  );
}
