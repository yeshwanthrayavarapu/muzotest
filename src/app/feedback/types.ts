export enum QuestionType {
  Text = "text",
  Number = "number",
  Select = "select",
}

export interface QuestionData {
  description: string;
  optional: boolean;
  type: QuestionType;
  options?: string[];
  tag?: string;
  dependant?: {
    tag: string;
    value: string;
  };
}

export type QuestionResponse = string | number;
