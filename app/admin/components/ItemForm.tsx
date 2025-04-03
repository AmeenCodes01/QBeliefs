"use client";
import React, { ReactNode, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormSelectProps<T extends FieldValues, K extends Path<T>> {
  field: ControllerRenderProps<T, K>; // Ensure key is a valid field path
  label: string;
  options?: { value: string; label: string }[];
  description?: string;
  placeholder?: string;
  datalist?: ReactNode;
  showbtn?: boolean;
  showInput?: boolean;
  edit:boolean;
  findLabel?: (type: "Topic" | "Question", id: string)=> string | undefined
  
}

function ItemForm<T extends FieldValues, K extends Path<T>>({
  field,
  label,
  options,
  description,
  placeholder,
  datalist,
  showbtn,
  showInput,
  edit,
  findLabel
}: FormSelectProps<T, K>) {
  const [show, setShow] = useState(showInput == undefined ? false : true);  
  // const [initialValue,setInitialValue] = useState(findLabel && findLabel("topic",field.value))

  useEffect(()=>{
    if(show){
     findLabel && findLabel(label as  "Topic" | "Question",field.value)
    }

  },[show])

  return (
    <FormItem className={` text-md   h-fit flex flex-col sm:text-xl ${ label.includes("Answer")?"max-h-[300px]":"h-[200px]"} w-full   `}>
      <FormLabel className="text-md">{label}</FormLabel>
      {!show ? (
        <Select
        disabled={edit}
          onValueChange={field.onChange}
//          defaultValue={field.value as string}
          value={field.value as string}
        >
          <FormControl>
            <SelectTrigger className="">
              <SelectValue
              
                placeholder={`Select a ${label.toLowerCase()} from list  `}
                className="text-right  ml-auto text-black flex items-end justify-end rtl placeholder:text-black"
              />
            </SelectTrigger>
          </FormControl>
          {datalist && datalist}{" "}
        </Select>
      ) : (
        <FormControl>
          <Input placeholder="Enter new ..." {...field} disabled={edit} value={ field.value} onChange={field.onChange}/>
        </FormControl>
      )}
      {showbtn == undefined ? (
        <Button
          type="button"
          className=" text-white text-sm p-2 h-[30px] text-center ml-auto"
          onClick={() => setShow((prev) => !prev)}
        >
          New + 
        </Button>
      ) : null}{" "}
      <FormMessage />
    </FormItem>
  );
}

export default ItemForm;
