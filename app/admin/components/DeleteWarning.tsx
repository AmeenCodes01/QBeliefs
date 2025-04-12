import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation";
  
  export default function DeleteWarning({qId}:{qId:string| null}) {
    const delAll = useMutation(api.questions.del);
const router = useRouter()
    return (
      
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="">Cancel
                </AlertDialogCancel>
            <AlertDialogAction className=" bg-destructive"  onClick={async()=>{
                               qId &&  await delAll({id:qId as Id<"Questions">}
                
                               )
                               router.push("/admin/manage")
                              }}>
                Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      
    )
  }
  