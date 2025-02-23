import { query } from "./_generated/server";



export const get = query({
  args: {},
  handler: async (ctx) => {
    
    let topics = await ctx.db.query("Topics").collect()
    topics = topics.filter((t)=> t.status === "approved")
    return topics
    
    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});