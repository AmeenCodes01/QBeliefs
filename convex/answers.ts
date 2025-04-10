import { v } from "convex/values";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import {
  getAll,
  getOneFrom,
  getManyFrom,
  getManyVia,
  getAllOrThrow,
} from "convex-helpers/server/relationships";
import { Doc, Id } from "./_generated/dataModel";
import { asyncMap } from "convex-helpers";

export type typesWithNameType = {
  typeWithName: {
    _id: Id<"Types">;
    _creationTime: number;
    name: string;
    sort_order: number;
  };
  _id: Id<"Ans_Types">;
  _creationTime: number;
  reference?: string | undefined;
  a_id: Id<"Answers">;
  type_id: Id<"Types">;
  content: string;

};

export const get = query({
  args: { qId: v.id("Questions"),   
     status: v.optional(v.union(
    v.literal("approved"),
    v.literal("rejected"),
    v.literal("waiting"),
  ) )},
  handler: async (ctx, { qId,status }) => {

    const result = await getAns(ctx,qId,status?status:"approved")
    return result
    
  },
});

export const delAns = mutation({
  args: { ansIds: v.array(v.id("Answers")),   
     },
  handler: async (ctx, { ansIds, }) => {
await asyncMap(ansIds, async(id)=>{
  const allAnsTypes = await getManyFrom(ctx.db,"Ans_Types", "by_aId",id,"a_id")
  const Ids = allAnsTypes?.map(a=>a._id).filter(Boolean)
  if(Ids){
    await asyncMap(Ids,async(i)=> await ctx.db.delete(i))
  }
await ctx.db.delete(id)
})

    // for each ans, remove Ans_Types.
    
  },
});


export const delAnsType = mutation({
  args: { id: (v.id("Ans_Types")),   
     },
  handler: async (ctx, { id, }) => {
await ctx.db.delete(id)


    // for each ans, remove Ans_Types.
    
  },
});


export async function getAns (ctx: QueryCtx,qId:Id<"Questions">,status:string) {
  // get answers Id from Answers table
  let answers = await getManyFrom(ctx.db, "Answers", "by_qId", qId, "q_id");
  answers = answers.filter(ans=> ans.status===status)
  // get all ans_types for each a_id
  
  const answerWithTypes = await asyncMap(
    answers.filter(Boolean),
    async (ans) => {
      // for each answer, get all types from Ans_Types
      const typesWithName = await AnsTypes(ctx,ans._id)

       return { ...ans,type:typesWithName };
       },
      );
      return answerWithTypes  // get all answers of a question. then get the Ans_Types. then get all types. do the sorting manually here ?

  // get types of each answer. //

  //query answers



}

export async function AnsTypes(ctx:QueryCtx, id:(Id<"Answers">)){
        // for each answer, get all types from Ans_Types
      const allTypes = await getManyFrom(
        ctx.db,
        "Ans_Types",
        "by_aId",
        id as Id<"Answers">,
        "a_id",
      );
      // for each type in Ans_Types, get name from Types.
      const typesWithName = await asyncMap(allTypes, async (type) => {
        const typeName = await ctx.db.get(type.type_id);
        return { ...type, typeWithName: typeName };
      });

      

       return typesWithName ;
   
}

