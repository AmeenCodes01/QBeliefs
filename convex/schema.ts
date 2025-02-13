import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
 Questions:defineTable({
  "q_no":v.number(), 
  "title":v.string()
 }),

 Answers: defineTable({
  
  title: v.string(),
  
}),

Q_A: defineTable({
  a_id: v.id("Answers"),
  q_id: v.id("Questions"),
}).index("by_qId", ["q_id"]).index("by_aId", ["a_id"])
,
Types: defineTable({
  "name":v.string(), 
  "sort_order": v.number(),
}),
Ans_Types: defineTable({
  "a_id": v.id("Answers"), 
  "type_id": v.id("Types"), 
  "content":v.string(),
  "reference": v.optional(v.string())   


}).index("by_aId",["a_id"]), 
Topics: defineTable({
  topic:v.string(), 
}), 
Topic_Ques: defineTable({
  "t_id": v.id("Topics"),
  "q_id":v.id("Questions")
}).index("by_tId",["t_id"]),
Surahs: defineTable({
  name: v.string(),
  surah: v.string(),
}),

});
