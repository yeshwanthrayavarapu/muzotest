import { QuestionType, QuestionData } from "@/types/feedback";

const QUESTIONS: QuestionData[] = [
  {
    description: "What was the quality of the generated music?",
    type: QuestionType.Number,
    optional: false,
  },
  {
    description: "How closely did the output match your request?",
    type: QuestionType.Number,
    optional: false,
  },
  {
    description: "Was the output musically interesting and unqiue?",
    type: QuestionType.Number,
    optional: false,
  },
  {
    description:
      "Are there any specific thoughts you had on the generated music?",
    type: QuestionType.Text,
    optional: true,
  },
  {
    tag: "usefulness",
    description:
      "Are there any ways that you think you could use Muzo in your own work?",
    type: QuestionType.Select,
    optional: false,
  },
  {
    dependant: { tag: "usefulness", value: "No" },
    description: "What are the issues or missing features that are preventing it from being useful to you?",
    type: QuestionType.Text,
    optional: false,
  },
  {
    dependant: { tag: "usefulness", value: "Yes" },
    description: "How would you use Muzo and what addtional features would help with your use-case?",
    type: QuestionType.Text,
    optional: false,
  },
  {
    description: "Were the loading and generation times acceptable?",
    type: QuestionType.Number,
    optional: false,
  },
  {
    description: "How easy was the user interface to use?",
    type: QuestionType.Number,
    optional: false,
  },
  {
    description: "How visually appealing was the user interface?",
    type: QuestionType.Number,
    optional: false,
  },
  {
    description:
      "Are there any specific issuess you experienced with or features you would like to see added to the user interface?",
    type: QuestionType.Text,
    optional: true,
  },
  {
    tag: "other-tools",
    description: "Have you used any other music generation tools before?",
    type: QuestionType.Select,
    optional: false,
    options: ["No", "Yes"],
  },
  {
    dependant: { tag: "other-tools", value: "Yes" },
    description:
      "What other tools have you used? How does Muzo compare to them?",
    type: QuestionType.Text,
    optional: true,
  },
];

import Feedback from "./Feedback";

export default function FullFeedbackPage() {
  return (
    <Feedback questionList={QUESTIONS} feedbackGroup="main-feedback" />
  )
}
