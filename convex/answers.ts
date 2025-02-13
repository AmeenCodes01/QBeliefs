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
  args: { qId: v.id("Questions") },
  handler: async (ctx, { qId }) => {

    const result = await getAns(ctx,qId)
    console.log(result)
    // get all answers
    // const q_a = await getManyFrom(db, "Q_A", "by_qId", qId, "q_id");
    // const ansId = q_a.map((r) => r.a_id);
    // const answers = await getAllOrThrow(db, ansId);

    // // get all answers of a question. then get the Ans_Types. then get all types. do the sorting manually here ?

    // // get types of each answer. //

    // //query answers

    // const answerWithTypes = await asyncMap(
    //   answers.filter(Boolean),
    //   async (ans) => {
    //     // for each answer, get all types from Ans_Types
    //     const allTypes = await getManyFrom(
    //       db,
    //       "Ans_Types",
    //       "by_aId",
    //       ans?._id as Id<"Answers">,
    //       "a_id",
    //     );
    //     // for each type in Ans_Types, get name from Types.
    //     const typesWithName = await asyncMap(allTypes, async (type) => {
    //       const typeName = await db.get(type.type_id);
    //       return { ...type, typeWithName: typeName };
    //     });

    //     const filteredTypesWithName = typesWithName.filter((item): item is typesWithNameType => item !== null);
    //      const sortedTypes = filteredTypesWithName.sort((a, b) => { return (a.typeWithName.sort_order as number) - (b.typeWithName.sort_order as number); });
    //     return { ...ans, type: sortedTypes };
    //     // const type =    await ctx.db.query("Types").withIndex("by_id")
    //   },
    // );

    // return answerWithTypes;

    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});

export async function getAns (ctx: QueryCtx,qId:Id<"Questions">) {
  const q_a = await getManyFrom(ctx.db, "Q_A", "by_qId", qId, "q_id");
  const ansId = q_a.map((r) => r.a_id);
  const answers = await getAllOrThrow(ctx.db, ansId);

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

      const filteredTypesWithName = typesWithName.filter((item): item is typesWithNameType => item !== null);
       const sortedTypes = filteredTypesWithName.sort((a, b) => { return (a.typeWithName.sort_order as number) - (b.typeWithName.sort_order as number); });
      return { ...ans, type: sortedTypes };
      // const type =    await ctx.db.query("Types").withIndex("by_id")
    },
  );

  return answerWithTypes;
}