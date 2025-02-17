import { useRef, useState } from "react";
import { SurveyResponse } from "../response";
import Question from "./Question";
import { QuestionData } from "../types";

interface Props {
  questionList: QuestionData[];
  unasweredQuestionWarnings: string[];
  submitAction: (response: SurveyResponse) => void;
}

export default function Form({ submitAction, unasweredQuestionWarnings, questionList }: Props) {
  const response = useRef(new SurveyResponse(questionList));
  const [_, setResponse] = useState(false);

  const rerender = () => {
    setResponse((prev) => !prev);
  };

  return (
    <div className="max-w-lg">
      {questionList.map((question, i) => {
        const hidden = response.current.isHidden(question, questionList);

        return (<div key={i}>
          <Question
            question={question}
            response={response.current}
            rerenderAction={rerender}
            number={i + 1}
            hidden={hidden}
            unansweredQuestionWarnings={unasweredQuestionWarnings}
          />
        </div>);
      })}
      <div className="w-full flex justify-center">
        <button
          onClick={() => submitAction(response.current)}
          className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-md hover:opacity-90 transition-opacity m-4"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
