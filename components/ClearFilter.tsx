import { useStore } from '@/lib/useStore';
import { X } from 'lucide-react';
import React from 'react'

function ClearFilter({name}:{name?:string}) {
     const setSurah = useStore((state) => state.setSurahId);
  return (
    <div
    className="flex flex-row  cursor-pointer gap-2 rounded-md p-2 md:p-1 justify-center items-center my-1 border-[1px] bg-primaryLight border-dark w-fit mr-auto  focus:cursor-pointer"
    onClick={() => setSurah(null)}
    >
      <X size={12} className="my-auto mx-auto " color='#184F46'/> 
      {name ?? <span className='text-dark border-2 ' >{name}</span>}
    </div>
  )
}

export default ClearFilter
