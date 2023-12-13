import { QUESTION_TYPE } from "@/definitions/question";

export type AnswerInTable = {
  id: string;
  created_at: string;
  timezone: string;
  client: string;
  value: string;
  register_name: string;
  type: QUESTION_TYPE;
  order: number;
  customerId: string;
  questionId: string;
  surveyId: string;
  [key: string]: string | number;
}

export type AnswerInsert = {
  client: string;
  value: string[];
  questionId: string;
  surveyId: string;
}