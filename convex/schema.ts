import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  Questions: defineTable({
    q_no: v.optional(v.number()),
    title: v.string(),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("waiting"),
    ),
    uploaderId: v.optional(v.string()),
  }).index("by_status", ["status"]),

  Answers: defineTable({
    q_id: v.id("Questions"),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("waiting"),
    ),
    uploaderId: v.optional(v.string()),

    // Connects to a question
  }).index("by_qId", ["q_id"]).index("by_status", ["status"]),




  Types: defineTable({
    name: v.string(),
    sort_order: v.number(),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("waiting"),
    ),
    uploaderId: v.optional(v.string()),
  }),

  Ans_Types: defineTable({
    a_id: v.id("Answers"),
    type_id: v.id("Types"),
    content: v.string(),
    reference: v.optional(v.string()),
    uploaderId: v.optional(v.string()),
  }).index("by_aId", ["a_id"]),

  Topics: defineTable({
    topic: v.string(),
    status: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("waiting"),
    ),
    uploaderId: v.optional(v.string()),
  }),

  Topic_Ques: defineTable({
    t_id: v.id("Topics"),
    q_id: v.id("Questions"),
  }).index("by_tId", ["t_id"]),

  Surahs: defineTable({
    name: v.string(),
    surah: v.string(),
  }),
  Surah_Ques: defineTable({
    s_id: v.id("Surahs"),
    q_id: v.id("Questions"),
  }).index("q_id", ["q_id"]),

  ...authTables,
});
