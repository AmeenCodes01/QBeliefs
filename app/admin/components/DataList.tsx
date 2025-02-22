import { SelectContent, SelectItem } from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";

const DataList = ({
    data,
    mapFn,
  }: {
    data: Doc<"Questions">[] | Doc<"Types">[] |Doc<"Topics">[] |Doc<"Surahs">[];
    mapFn: (item: any ) => { value: string; label: string };
  }) => {
    return(
    
    <SelectContent className="bg-white  text-right ml-auto flex rtl">
      {data?.map((item) => {
        const { value, label } = mapFn(item);
        return (
          <SelectItem key={value} value={value} className="text-right hover:bg-hover ml-auto  flex items-end justify-end rtl">
            {label}
          </SelectItem>
        );
      })}
    </SelectContent>
  );}
  
  export default DataList