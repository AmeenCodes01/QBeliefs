"use client"
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import React from 'react'

function Provider({children}: {children: React.ReactNode}) {
  return (
    <div suppressHydrationWarning={true} className='w-full h-full flex'>
      <Unauthenticated>
      <SignInButton mode="modal"/>
      </Unauthenticated>
      <Authenticated>
        {/* <UserButton/> */}
        {children}
      </Authenticated>
    </div>
  )
}

export default Provider
