import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className='w-full px-4 py-4 flex justify-start text-center border-[1px] '> 
    <Link href={"/"}>
      <h1 className='text-2xl font-bold '>Quranic Beliefs</h1>
    </Link>
    </div>
  )
}

export default Header
