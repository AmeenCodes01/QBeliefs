import { Doc, Id } from "./convex/_generated/dataModel";

export type AnswerType = {
  _id: Id<"Answers">;
  q_id:Id<"Questions">;
  _creationTime: number;
  type: {
    typeWithName: {
      _id: Id<"Types">;
      _creationTime: number;
      name: string;
      sort_order: number;
    }| null;
    _id: Id<"Ans_Types">;
    _creationTime: number;
    reference?: string | undefined;
    a_id: Id<"Answers">;
    type_id: Id<"Types">;
    content: string;
  }[];
  status: string;
};

export type AnsProps = {
  ans: AnswerType;
};

export type QuesProps = {
  ques: Doc<"Questions">;
  ans: AnswerType;
};
