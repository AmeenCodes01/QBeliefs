"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import React, { useState } from "react";

function AcceptReject({
  topicId,
  qId,
  ansId,
  typeIds,
}: {
  topicId: Id<"Topics">;
  qId: Id<"Questions">;
  ansId: Id<"Answers">;
  typeIds: Id<"Types">[];
}) {
  const [note,setNote]=useState("")
  
  const accept = useMutation(api.admin.accept);
  const reject = useMutation(api.admin.reject)
  const onAccept = async () => {
    await accept({ qId, topicId, ansId, typeIds });
  };
  const onReject = async () => {
    //get reason through popup?
    await reject({ qId, topicId, ansId, typeIds, note});
  };

  return (
    <div className="w-full flex justify-end gap-2 text-white">
      <Button onClick={onAccept} className="text-white">
        Accept
      </Button>
      <Dialog>

      <DialogTrigger>
      <Button className="bg-red-500 text-white">Reject</Button>

      </DialogTrigger>
      <DialogContent>
    <DialogHeader>
      <DialogTitle>Rejection reason</DialogTitle>
      <DialogDescription>
        please make it clear
      </DialogDescription>
    </DialogHeader>
    <Input value={note} onChange={e=> setNote(e.target.value)}/>

    <DialogFooter className="sm:justify-start">
          <DialogClose asChild onClick={onReject}>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
  </DialogContent>

      </Dialog>
    </div>
  );
}

export default AcceptReject;
// on REJECT, A NOTE IS GIVEN SAYING WHY REJECTED.
//REJECTED SHOULD SHOW UP IN MANAGE PAGE.
// THEN IN MANAGE PAGE, REJECTED TAB, THERE SHOULD BE OPTION TO VIEW NOTE + EDIT AGAIN.
// MANAGE PAGE WILL HAVE 2 TABS. INCOMING + REJECTED.
