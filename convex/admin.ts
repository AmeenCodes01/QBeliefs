import { query, mutation, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import {
    getAll,
    getOneFrom,
    getManyFrom,
    getManyVia,
    getAllOrThrow,
  } from "convex-helpers/server/relationships";
import { asyncMap } from "convex-helpers";
import { Id } from "./_generated/dataModel";


export const getQues = query({
  args: {},
  handler: async (ctx) => {
    
    const questions = await getManyFrom(ctx.db,"Questions","by_status","waiting")

    return questions
    
    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});


export const create = mutation({
  args: {
    topic:v.union(v.string(),v.id("Topics")),
    question:v.union(v.string(),v.id("Questions")),
    surah:v.id("Surahs"),
    answers:v.array(v.record(v.string(),v.string() )), 


  },
  handler: async (ctx,{topic,question,surah,answers}) => {
    console.log("helo")
    const topicId = await checkAndCreate(ctx,topic,"Topics" );
    console.log(topicId,"topicId")
    const quesId = await checkAndCreate(ctx, question,"Questions");

    const surahQues = await ctx.db.insert("Surah_Ques",{s_id:surah, q_id:quesId as Id<"Questions"> });
    const topicQues = await ctx.db.insert("Topic_Ques",{t_id:topicId as Id<"Topics">, q_id:quesId as Id<"Questions"> });
    
    const ansId = await ctx.db.insert("Answers",{q_id: quesId as Id<"Questions">, status:"waiting"});
    
    await asyncMap(
        answers, 
        async(ans)=>{

            const typeId = await checkAndCreate(ctx, ans.type, "Types");
        console.log(typeId,"typeId")
            const ansType = await ctx.db.insert("Ans_Types", {a_id:ansId as Id<"Answers">, type_id:typeId as Id<"Types">, content:ans.text, reference:ans?.reference ?? ""})
           
        }

    )
    return 
    
    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});


async function checkAndCreate(
    ctx: MutationCtx,
    id: Id<"Questions"> | Id<"Types"> | Id<"Topics"> | Id<"Answers"> | string,
    label: "Questions" | "Types" | "Topics" | "Answers" // Ensure correct collection name
  ) {
    let ID = id; // Keep track of the final ID
    const status = "waiting";
    if (label === "Questions") {
      try {
        const checkQues = await ctx.db.get(id as Id<"Questions">);
      } catch (error) {
        console.error(`Error fetching Question with ID ${id}:`, error);
        const lastQues = await ctx.db.query("Questions").order("desc").take(1);
        ID = await ctx.db.insert("Questions", {
          title: id,
          q_no: lastQues.length > 0 ? (lastQues[0]?.q_no ?? 0)+ 1 : 1, 
          status
          // Default to 1 if no previous questions exist
        });
      }
    }
  
    if (label === "Topics") {
      try {
        const checkTopic = await ctx.db.get(id as Id<"Topics">);
        console.log(checkTopic, "checkTopic");
      } catch (error) {
        console.error(`Error fetching Topic with ID ${id}:`, error);
        ID = await ctx.db.insert("Topics", { topic: id, status });
      }
    }
  
    if (label === "Types") {
      try {
        const checkType = await ctx.db.get(id as Id<"Types">);
      } catch (error) {
        console.error(`Error fetching Type with ID ${id}:`, error);
        const allTypes = await ctx.db.query("Types").collect();
        const greatestSortOrder = allTypes.reduce((max, s) => (s.sort_order > max ? s.sort_order : max), 0);
        ID = await ctx.db.insert("Types", { name: id, sort_order: greatestSortOrder + 1, status });
      }
    }
  
    // if (label === "Answers") {
    //   try {
    //     await ctx.db.get(id as Id<"Answers">);
    //   } catch (error) {
    //     console.error(`Error fetching Answer with ID ${id}:`, error);
    //     ID = await ctx.db.insert("Answers", { title: id });
    //   }
    // }
  
    return ID; // Return the existing or newly created ID
  }
  