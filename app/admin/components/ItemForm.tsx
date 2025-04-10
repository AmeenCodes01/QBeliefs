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
  editInput:boolean;
  answerIndex?:number;
  typeIndex?:number;

  findLabel?:( args:{
    type: "Topic" | "Question"| "Type";
    id?: string;
    text?: string;
    answerIndex?:number;
    typeIndex?:number;
  })=> void;
  resetField?: (type: "Topic" | "Question")=> void;
  
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
  editInput,
  findLabel,
  resetField,
  answerIndex,
  typeIndex
}: FormSelectProps<T, K>) {
  const [show, setShow] = useState(showInput == undefined ? false : true);  
  // const [initialValue,setInitialValue] = useState(findLabel && findLabel("topic",field.value))

  // useEffect(()=>{
  //   console.log("UseEffect run")
  //   if(show){
  //    findLabel && findLabel(label as  "Topic" | "Question",field.value)
  //   }else{
  //     resetField && resetField(label as  "Topic" | "Question")
  //   }

  // },[show])
// console.log(label=="Question" && field.value.title, " field")
  return (
    
    <FormItem className={` text-md   h-fit flex flex-col sm:text-xl ${ label.includes("Answer")?"max-h-[300px]":"h-[200px]"} w-full   `}>
      <FormLabel className="text-md">{label}</FormLabel>
      {!show ? (
        <Select
        disabled={editInput}
        onValueChange={(val)=>{
          if(label=="Surah"){
            field.onChange(val)
          }else{

            findLabel && findLabel({id:val,type:label as "Topic"|"Question"|"Type",answerIndex,typeIndex})
          }
        
        }
        }
      
                 // defaultValue={field.value as string}
          value={label=="Type" ?field.value.type : label=="Surah"? field.value: field.value.id}
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
          {/* We can't create a {} for  */}
          <Input placeholder="Enter new ..." {...field} disabled={editInput} value={ label=="Type" ? field.value.text: field.value.title} onChange={(e)=> findLabel && findLabel({type:label as "Topic"|"Question"|"Type",text:e.target.value,answerIndex,typeIndex})   }/>
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
