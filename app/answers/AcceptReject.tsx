"use client"
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import React from 'react'

 function AcceptReject({topicId,qId,ansId}:{
  topicId:Id<"Topics">,
  qId:Id<"Questions">,
  ansId:Id<"Answers">
}) {
  const accept = useMutation(api.admin.accept)
const onAccept = async()=>{ await accept({qId, topicId, ansId})
}

  return (
    <div className='w-full flex justify-between text-white'>
      <Button onClick={onAccept} className='text-white'>
Accept
      </Button>
      <Button className='bg-red-500 text-white'>
Reject
      </Button>
    </div>
  )
}

export default AcceptReject
