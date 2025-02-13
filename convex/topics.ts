import { query } from "./_generated/server";



export const get = query({
  args: {},
  handler: async (ctx) => {
    
    const topics = await ctx.db.query("Topics").collect()

    return topics
    
    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});