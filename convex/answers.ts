import { v } from "convex/values";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import {
  getAll,
  getOneFrom,
  getManyFrom,
  getManyVia,
  getAllOrThrow,
} from "convex-helpers/server/relationships";
import { Id } from "./_generated/dataModel";
import { asyncMap } from "convex-helpers";

type typesWithNameType = {
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

export async function getAns (ctx: QueryCtx,qId:Id<"Questions">,status:string) {
  // get answers Id from Answers table
  let answers = await getManyFrom(ctx.db, "Answers", "by_qId", qId, "q_id");
  answers = answers.filter(ans=> ans.status===status)
  // get all ans_types for each a_id
  
  // get all answers of a question. then get the Ans_Types. then get all types. do the sorting manually here ?

  // get types of each answer. //

  //query answers

  const answerWithTypes = await asyncMap(
    answers.filter(Boolean),
    async (ans) => {
      // for each answer, get all types from Ans_Types
      const allTypes = await getManyFrom(
        ctx.db,
        "Ans_Types",
        "by_aId",
        ans?._id as Id<"Answers">,
        "a_id",
      );
      // for each type in Ans_Types, get name from Types.
      const typesWithName = await asyncMap(allTypes, async (type) => {
        const typeName = await ctx.db.get(type.type_id);
        return { ...type, typeWithName: typeName };
      });

       return { ...ans,type:typesWithName };
       },
  );

  return answerWithTypes;
}

