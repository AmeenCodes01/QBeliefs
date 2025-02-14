import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className='w-full px-4 py-4 flex    bg-dark
    sticky top-0 z-50 text-right justify-end
    '> 
    <Link href={"/"}>
      <h1 className='text-2xl text-white ml-auto  '>مختلف قرآنی تفاسیر سے  ماخوذ سوالات و جوابات </h1>
    </Link>
    </div>
  )
}

export default Header
