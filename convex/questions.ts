import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
    getAll,
    getOneFrom,
    getManyFrom,
    getManyVia,
  } from "convex-helpers/server/relationships";
  
export const get = query({
  args: {},
  handler: async (ctx) => {
    
    const questions = await ctx.db.query("Questions").order("desc").collect()

    return questions
    
    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});

export const getById = query({
  args: {qId:v.id("Questions")},
  handler: async (ctx,{qId}) => {
    
    const question = await ctx.db.get(qId)

    return question
    
    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});

// export const send = mutation({
//   args: { body: v.string(), author: v.string() },
//   handler: async (ctx, { body, author }) => {
//     // Send a new message.
//     await ctx.db.insert("messages", { body, author });
//   },
// });
