import { QuestionData } from "@/types/feedback";
import { SurveyResponse } from "./response";

import Feild from "./Field";

interface Props {
  number: number;
  question: QuestionData;
  hidden: boolean;
  response: SurveyResponse;
  rerenderAction: () => void;
  unansweredQuestionWarnings: string[];
}

export default function Question({
  question,
  response,
  number,
  hidden,
  rerenderAction,
  unansweredQuestionWarnings,
}: Props) {
  const optional = !question.optional || (
    <span className="text-xs m-3">(optional)</span>
  );

  const showWarning = unansweredQuestionWarnings.includes(question.description);

  const title = (
    <div className={`m-[0.7rem] flex items-center ${showWarning ? "text-red-500" : ""}`}>
      <span className="font-bold">{number}.{question.optional || "*"}</span>
      {hidden ? (
        <span className="text-textSecondary mx-4">(not required)</span>
      ) : (
        <span className="mx-4">
          {question.description}
          {optional}
        </span>
      )}
    </div>
  );

  const content = hidden || (
    <div className="flex justify-center w-full">
      <Feild question={question} response={response} rerender={rerenderAction} />
    </div>
  );

  return (
    <div>
      {title}
      {content}
    </div>
  );
}
