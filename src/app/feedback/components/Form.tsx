import { useRef, useState } from "react";
import { SurveyResponse } from "../response";
import Question from "./Question";
import { QUESTIONS } from "../questions";

interface Props {
  unasweredQuestionWarnings: string[];
  submitAction: (response: SurveyResponse) => void;
}

export default function Form({ submitAction, unasweredQuestionWarnings }: Props) {
  const response = useRef(new SurveyResponse());
  const [_, setResponse] = useState(false);

  const rerender = () => {
    setResponse((prev) => !prev);
  };

  return (
    <div className="max-w-lg">
      {QUESTIONS.map((question, i) => (
        <div key={i}>
          <Question
            question={question}
            response={response.current}
            rerenderAction={rerender}
            number={i + 1}
            unansweredQuestionWarnings={unasweredQuestionWarnings}
          />
        </div>
      ))}
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
