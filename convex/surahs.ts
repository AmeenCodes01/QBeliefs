import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    
    const surahs = await ctx.db.query("Surahs").collect()

    return surahs
    
    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});

