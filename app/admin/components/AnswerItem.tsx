
import { useFieldArray, UseFieldArrayRemove, useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ItemForm from "../components/ItemForm";
import { Doc, Id } from "@/convex/_generated/dataModel";
import DataList from "../components/DataList";

const AnswerItem = ({
    control,
    answerIndex,
    onRemoveAnswer,
    types,
    ansLength,
    editInput,
    findLabel,
    onRemoveType
  }: {
    control: any;
    answerIndex: number;
    onRemoveAnswer: () => void;
    ansLength: number;
    types: Doc<"Types">[] | undefined,
    editInput:boolean,
    findLabel: ({ type, id, text, answerIndex, typeIndex, }: {
      type: "Topic" | "Question" | "Type"|"Surah";
      id?: string;
      text?: string;
      answerIndex?: number;
      typeIndex?: number;
  }) => void
   onRemoveType: (answerIndex: number, typeIndex: number, remove: UseFieldArrayRemove) => Promise<void>;
  }) => {

    const surahs = useQuery(api.surahs.get);

    const {
      fields: typesFields,
      append: appendType,
      remove: removeType,
    } = useFieldArray({
      control,
      name: `answers.${answerIndex}.types`,
    });
  


   
    return (
      <div className="space-y-4 border p-4 rounded-md mb-4 ">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Answer {answerIndex + 1}</h3>
          <Button
            type="button"
            disabled={ansLength ==1}
            variant="destructive"
            size="sm"
            onClick={onRemoveAnswer}
          >
            Remove Answer
          </Button>
        </div>
        <FormField
            control={control}
            name={`answers.${answerIndex}.s_id`}
            render={({ field }) => (
              <ItemForm
                editInput={editInput}
                field={field}
                label="Surah"
                findLabel={findLabel}
answerIndex={answerIndex}
                datalist={
                  <DataList
                    data={surahs as Doc<"Surahs">[]}
                    mapFn={(s) => ({
                      value: s._id,
                      label: s.name,
                    })}
                  />
                }
                showbtn={false}
              />
            )}
          />
        {typesFields.map((typeField, typeIndex) => (
          <div key={typeField.id} className="space-y-2 border-2 h-fit p-2 rounded">
            <FormField
              control={control}
              name={`answers.${answerIndex}.types.${typeIndex}`}
              render={({ field }) => (
                <FormItem>
                 <ItemForm
                  editInput={editInput}
                  field={field}
                  findLabel={findLabel}
                  answerIndex={answerIndex}
                  typeIndex={typeIndex}
                  showbtn={false}
                  label="Type"
                  datalist={
                  <DataList
                    data={types as Doc<"Types">[]}
                    mapFn={(s) => ({
                      value: s._id,
                      label: s.name,
                    })}
                  />
                }
              />
                </FormItem>
              )}
            />
  
            <FormField
              control={control}
              name={`answers.${answerIndex}.types.${typeIndex}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} disabled={editInput} placeholder="Text" className="mb-2" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <FormField
              control={control}
              name={`answers.${answerIndex}.types.${typeIndex}.reference`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} disabled={editInput} placeholder="Reference (optional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  
            <Button
              type="button"
              variant="destructive"
              disabled ={typesFields.length ==1} 
              size="sm"
              onClick={async() =>{
                if(typesFields.length > 1){

                  onRemoveType(answerIndex,typeIndex,removeType)
                }
              }
              
                }
            >
              Remove Type
            </Button>
          </div>
        ))}
  
        <Button
          type="button"
         
          size="sm"
          onClick={() => appendType({ type: "", text: "", reference: "",id:"" })}
        >
          + Add Type
        </Button>
      </div>
    );
  };

  export default AnswerItem