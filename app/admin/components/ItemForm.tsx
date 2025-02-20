"use client"
import React, { ReactNode, useState } from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Doc } from '@/convex/_generated/dataModel';

  interface FormSelectProps<T extends FieldValues, K extends Path<T>> {
    field: ControllerRenderProps<T, K>; // Ensure key is a valid field path
    label: string;
    options?: { value: string; label: string }[];
    description?: string;
    placeholder?: string;
datalist?: ReactNode;
showbtn ?:boolean;
    showInput?:boolean;
  }

function ItemForm<T extends FieldValues, K extends Path<T>>({ 
    field, label, options, description, placeholder ,datalist, showbtn,showInput
  }: FormSelectProps<T, K>) {
    const [show, setShow]=useState(showInput ==undefined ? false:true)
    
  return (
    <FormItem className=' text-md flex flex-col text-xl w-full '>
    <FormLabel className='text-md'>{label}</FormLabel>
    {!show ?
    <Select onValueChange={field.onChange} defaultValue={field.value as string} >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={`Select a ${label.toLowerCase()} from list  `} className='text-rigt'/>
        </SelectTrigger>
      </FormControl>
{   datalist && datalist
}    </Select>:  <FormControl>
                <Input placeholder="Enter new ..." {...field} />


              </FormControl>}
{     showbtn == undefined ?     <Button type='button' className=' text-white p-4 ml-auto' onClick={()=>setShow(prev=> !prev)}>New</Button>
:null}    <FormMessage />
  </FormItem>
  )
}

export default ItemForm
