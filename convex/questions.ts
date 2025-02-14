import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
    getAll,
    getOneFrom,
    getManyFrom,
    getManyVia,
    getAllOrThrow,
  } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";
import { getAns } from "./answers";

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

export const getByTopic = query({
  args: {topicId:v.id("Topics")},
  handler: async (ctx,args) => {
    
  const t_q = await getManyFrom(ctx.db,"Topic_Ques","by_tId", args.topicId,"t_id" )
      const quesId = t_q.map((r) => r.q_id);

      const questions = await getAllOrThrow(ctx.db,quesId);
      const quesAns =await asyncMap(questions.filter(Boolean), async(ques)=>{
         const ans = await getAns(ctx, ques._id)
         const surahQues = await getManyFrom(ctx.db,"Surah_Ques","q_id", ques._id)
         const surahIds = surahQues.map(u=>u.s_id)
         return {...ques, ans, surahIds}
      })
      console.log(quesAns)
  
    // const questions = await ctx.db.

    return quesAns
    
    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});
