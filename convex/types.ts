import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
      
      const types = await ctx.db.query("Types").collect()
  
      return types
      
      // const answers = await getManyFrom(db,"Answers","by_qId",)
    },
  });
  