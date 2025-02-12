import { QuestionData } from "../types";
import { SurveyResponse } from "../response";
import { QUESTIONS } from "../questions";
import Feild from "./Field";

interface Props {
  number: number;
  question: QuestionData;
  response: SurveyResponse;
  rerenderAction: () => void;
  unansweredQuestionWarnings: string[];
}

export default function Question({
  question,
  response,
  number,
  rerenderAction,
  unansweredQuestionWarnings,
}: Props) {
  const hidden = response.isHidden(question);

  const optional = !question.optional || (
    <span className="text-xs m-3">(optional)</span>
  );

  const showWarning = unansweredQuestionWarnings.includes(question.description);

  const title = (
    <div className={`m-[0.7rem] flex items-center ${showWarning ? "text-red-500" : ""}`}>
      <span className="font-bold">{number}.{question.optional || "*"}</span>
      {hidden ? (
        <span className="text-gray-600 mx-4">(not required)</span>
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
