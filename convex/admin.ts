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
import { AnsTypes } from "./answers";





export const create = mutation({
  args: {
    topic: v.object({id:v.union(v.string(), v.id("Topics")), title:v.optional(v.string())}),
    question: v.object({id:v.union(v.string(), v.id("Questions")),
       title:v.optional(v.string()), 
        no: v.optional(v.string())
    }),
    answers: v.optional(v.array(
      v.object({
        id:v.optional(  v.union(v.string(),v.id("Answers")) ),
        s_id:v.optional(v.id("Surahs")),
        types: v.optional(v.array(
          v.object({
            type: v.string(),
            text: v.string(),
            id: v.optional(  v.union(v.string(),v.id("Ans_Types")) ),
            reference: v.optional(v.string()),
          }),
        )),
      }),
    )),
  
  },

  handler: async (ctx, { topic, question, answers }) => {

    console.log(topic, "topic")
    
    let topicId = topic.id
    let quesId = question.id
    const status = "waiting"
   //if topic or question change, we need to patch. 
    
    if(topic?.id !=="" && topic?.title!==""){
      //id & title means edit. 
      await ctx.db.patch(topic.id as Id<"Topics">, {topic:topic.title ?? ""}) 
      //for q, patch topicId too.
      
     

    }else if(topic.id=="" && topic.title!==""){
      //create new
       topicId = await ctx.db.insert("Topics", { topic: topic.title as string, status });
       console.log("created topic", topicId)
       
       
 
    }



    if(question.id !=="" && question?.title!==""){
      //edit
      await ctx.db.patch(question.id as Id<"Questions">,{title:question?.title as string})
      // use patch, so need relation id 
      const topicQues = await getOneFrom(ctx.db, "Topic_Ques","q_id",question.id as Id<"Questions">)
      topicQues && await ctx.db.patch(topicQues?._id,{t_id:topic.id as Id<"Topics">})


      //get from old question. 
//       const answers = await getManyFrom(ctx.db,"Answers","by_qId",quesId as Id<"Questions">,"q_id");
//       const ansIds = answers?.map(ans=> ans._id).filter(Boolean)
//       console.log(ansIds, quesId, " editing ans ques")
// //should put a check if q_id changed prev or not. but whatever
//       if(ansIds ){
//         //there are no ansIds. get them by making a call or recieve from client.
//         await asyncMap(ansIds,async(id)=>{
//         id!==null && await ctx.db.patch(id as Id<"Answers">,{q_id:quesId as Id<"Questions"> })
//         })
//       }

    }else if(question.id=="" && question.title!==""){
      //create
    //  const lastQues = await ctx.db.query("Questions").order("desc").take(1);
       quesId = await ctx.db.insert("Questions", {
        title: question.title as string,
        q_no: question?.no,
        status:status ,
        // Default to 1 if no previous questions exist
      });
     
      //link with topic
      const topicQues = await ctx.db.insert("Topic_Ques", {
        t_id: topicId as Id<"Topics">,
        q_id: quesId as Id<"Questions">,
      });
    
    
    
    
    }


    
  


    //const quesId = await checkAndCreate(ctx, question, "Questions");


if(answers){

  await asyncMap(answers, async (ans) => {
    //types:[{ }]
    let ansId = ans.id
    console.log(ansId," ansId")
    if(ans.id ===""){
//create
       ansId = await ctx.db.insert("Answers", {
        s_id: ans.s_id as Id<"Surahs">,
        q_id: quesId as Id<"Questions">,
        status,
      });

    }else if(ans.s_id){
      await ctx.db.patch(ansId as Id<"Answers">,{s_id:ans.s_id})

    }

if(ans.types){

await asyncMap(ans.types, async (type) => {
console.log(type, " type")
  if(type.id===""){
    //create

      const ansType = await ctx.db.insert("Ans_Types", {
        a_id: ansId as Id<"Answers">,
        type_id: type.type as Id<"Types">,
        content: type.text,
        reference: type?.reference ?? "",
      });
    
    }else{
      await ctx.db.patch(type.id as Id<"Ans_Types">, {
        type_id: type.type as Id<"Types">,
        content: type.text,
        reference: type?.reference ?? "",
      });
    }



});

}
  });
}

    return "success";

    // const answers = await getManyFrom(db,"Answers","by_qId",)
  },
});


export const getWaitingQues = query({
  args: {},
  handler: async (ctx, args) => {
    //const answers = await getManyFrom(ctx.db,"Answers","by_status","waiting","status" );
    const answers = await ctx.db
      .query("Answers")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .collect();
    console.log(answers, "answers server");
    const answerQues = await asyncMap(answers.filter(Boolean), async (ans) => {
      const { q_id, ...rest } = ans;
      const ques = await ctx.db.get(q_id);
      //const topic =await  getManyVia(ctx.db,"Topic_Ques","t_id","q_id",q_id)

      return { question: ques };
    });
    console.log(answerQues, "answerQues");

    const uniqueQuestionsMap = new Map();
    const uniqueQuestions = answerQues
      .filter((qa) => {
        if (!uniqueQuestionsMap.has(qa.question?._id)) {
          // Store both the question and topic as an object
          uniqueQuestionsMap.set(qa.question?._id, { question: qa.question });
          return true;
        }
        return false;
      })
      .map((qa) => {
        // Map to get the question and topic
        const storedData = uniqueQuestionsMap.get(qa.question?._id);
        return storedData
          ? { question: storedData.question, topic: storedData.topic }
          : null;
      })
      .filter(Boolean);
    return uniqueQuestions;
  },
});

export const getAns = query({
  args: {
    qId: v.optional(v.id("Questions")),
  },

  handler: async (ctx, args) => {
    if(!args.qId)return null
    let answers = await getManyFrom(
      ctx.db,
      "Answers",
      "by_qId",
      args.qId,
      "q_id",
    );

    console.log(answers, " ANSWERS")
    answers = answers.filter((a) => a.status == "waiting");
    const topic = await getManyVia(
      ctx.db,
      "Topic_Ques",
      "t_id",
      "q_id",
      args.qId,
    );
    const ques = await ctx.db.get(args.qId);
    
    

    const AnsWithTypes = await asyncMap(
      answers.filter(Boolean),
      async (ans) => {
        const typesWithName = await AnsTypes(ctx, ans._id);

        return { ...ans, type: typesWithName };
      },
    );

    const AnsTopicsQues = [
      [...AnsWithTypes],
      { topic },
      { qTitle: ques?.title, qStatus:ques?.status },
    ];

    return AnsTopicsQues;
    // just add question & topic to ans along types.
  },
});

export const accept = mutation({
  args: {
    topicId: v.id("Topics"),
    qId: v.id("Questions"),
    ansId: v.id("Answers"),
    typeIds: v.optional(v.array(v.id("Types")))
  },
  handler: async (ctx, { topicId, qId, ansId, typeIds }) => {
    //change topic,ques,ans status.
    // I will get topicId, ansId, qId.
    const topic = await ctx.db.get(topicId);
    if (topic?.status !== "approved") {
      await ctx.db.patch(topicId, { status: "approved" });
    }
    const ques = await ctx.db.get(qId);

    if (ques?.status !== "approved") {
      await ctx.db.patch(qId, { status: "approved" });
    }

    const ans = await ctx.db.get(ansId);

    if (ans?.status !== "approved") {
      await ctx.db.patch(ansId, { status: "approved" });
    }

    const types = await ctx.db.query("Types").collect()
if(typeIds){

  asyncMap(typeIds, async(id)=>{
    
    asyncMap(types, async(t)=>{
      if (id == t._id && t.status !=="approved"){
        await ctx.db.patch(id,{status:"approved"})
      }
    })

        })
  

}
return "success"
}
});

export const reject = mutation({
  args: {
    topicId: v.id("Topics"),
    qId: v.id("Questions"),
    ansId: v.id("Answers"),
    typeIds: v.array(v.id("Types")),
    qNote:v.optional(v.string()),
    aNote:v.optional(v.string())  
  },
  handler: async (ctx, { topicId, qId, ansId, typeIds,qNote,aNote }) => {
    //change topic,ques,ans status.
    // I will get topicId, ansId, qId.

    
    const topic = await ctx.db.get(topicId);
    if (topic?.status === "waiting") {
      await ctx.db.patch(topicId, { status: "rejected" });
    }

    const ques = await ctx.db.get(qId);

    if (ques?.status === "waiting") {
      await ctx.db.patch(qId, { status: ques?.status === "waiting" ? "rejected":ques.status, rejectNote:qNote });
    }

    const ans = await ctx.db.get(ansId);

    if (ans?.status === "waiting") {
      await ctx.db.patch(ansId, { status: "rejected", });
    }

    const types = await ctx.db.query("Types").collect()

    asyncMap(typeIds, async(id)=>{
      
      asyncMap(types, async(t)=>{
        if (id == t._id && t.status ==="waiting"){
          await ctx.db.patch(id,{status:"rejected"})
        }
      })

          })
    

  },
});

// async function checkAndCreate(
//   ctx: MutationCtx,
//   id: Id<"Questions"> | Id<"Types"> | Id<"Topics"> | Id<"Answers"> | string,
//   label: "Questions" | "Types" | "Topics" | "Answers", // Ensure correct collection name
// ) {
//   let ID = id; // Keep track of the final ID
//   const status = "waiting";

//   if (label === "Questions") {
//     // if id="" create. 
//     try {
//       const checkQues = await ctx.db.get(id as Id<"Questions">);
//     } catch (error) {
//       console.error(`Error fetching Question with ID ${id}:`, error);
//       const lastQues = await ctx.db.query("Questions").order("desc").take(1);
//       ID = await ctx.db.insert("Questions", {
//         title: id,
//         q_no: lastQues.length > 0 ? (lastQues[0]?.q_no ?? 0) + 1 : 1,
//         status,
//         // Default to 1 if no previous questions exist
//       });
//     }
//   }

//   if (label === "Topics") {
//     try {
//       const checkTopic = await ctx.db.get(id as Id<"Topics">);
//       console.log(checkTopic, "checkTopic");
//     } catch (error) {
//       console.error(`Error fetching Topic with ID ${id}:`, error);
//       ID = await ctx.db.insert("Topics", { topic: id, status });
//     }
//   }

//   if (label === "Types") {
//     try {
//       const checkType = await ctx.db.get(id as Id<"Types">);
//     } catch (error) {
//       console.error(`Error fetching Type with ID ${id}:`, error);
//       const allTypes = await ctx.db.query("Types").collect();
//       const greatestSortOrder = allTypes.reduce(
//         (max, s) => (s.sort_order > max ? s.sort_order : max),
//         0,
//       );
//       ID = await ctx.db.insert("Types", {
//         name: id,
//         sort_order: greatestSortOrder + 1,
//         status,
//       });
//     }
//   }

//   // if (label === "Answers") {
//   //   try {
//   //     await ctx.db.get(id as Id<"Answers">);
//   //   } catch (error) {
//   //     console.error(`Error fetching Answer with ID ${id}:`, error);
//   //     ID = await ctx.db.insert("Answers", { title: id });
//   //   }
//   // }

//   return ID; // Return the existing or newly created ID
// }
