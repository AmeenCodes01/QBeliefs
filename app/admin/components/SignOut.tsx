"use client"
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
 
export function SignOut() {
  const { signOut } = useAuthActions();
  return <Button variant="destructive" className="bg-destructive w-[300px]" onClick={() => void signOut()}>Sign out</Button>;
} 