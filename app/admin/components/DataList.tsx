import { SelectContent, SelectItem } from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";

const DataList = ({
    data,
    mapFn,
  }: {
    data: Doc<"Questions">[] | Doc<"Types">[] |Doc<"Topics">[] |Doc<"Answers">[]|Doc<"Surahs">[];
    mapFn: (item: any ) => { value: string; label: string };
  }) => {
    return(
    
    <SelectContent className="bg-white text-right ml-auto flex rtl">
      {data?.map((item) => {
        const { value, label } = mapFn(item);
        return (
          <SelectItem key={value} value={value} className="text-right  ml-auto rtl">
            {label}
          </SelectItem>
        );
      })}
    </SelectContent>
  );}
  
  export default DataList