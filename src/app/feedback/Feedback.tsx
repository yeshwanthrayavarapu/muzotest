"use client";

import { SurveyResponse } from "./response";
import { useRef, useState } from "react";
import { QuestionData } from "@/types/feedback";
import Question from "./Question";
import { useSession } from "next-auth/react";

interface Props {
  questionList: QuestionData[];
  attachedData?: any;
  feedbackGroup: string;
};

export default function Feedback({ questionList, attachedData, feedbackGroup }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unansweredQuestionWarnings, setUnansweredQuestionWarnings] = useState<string[]>([]);

  const { data: session } = useSession();

  const response = useRef(
    new SurveyResponse(
      questionList,
      attachedData,
      feedbackGroup,
      session?.user.id
    )
  );

  const [_, setResponse] = useState(false);

  const rerender = () => {
    setResponse((prev) => !prev);
  };

  const submit = async (surveyResponse: SurveyResponse) => {
    const missingQuestions = surveyResponse.missingNonOptionalQuestions(questionList);
    if (missingQuestions.length > 0) {
      setUnansweredQuestionWarnings(missingQuestions);
      setError("Please answer all required questions.");
      return;
    }

    surveyResponse.addDefaultResponses(questionList);
    surveyResponse.removeHiddenResponses(questionList);

    const response = await surveyResponse.submit();

    if (!response.ok) {
      setError(await response.text());
      return;
    }

    setError(null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full h-[15rem] flex justify-center items-center flex-col gap-4">
        <div className="text-xl">
          Thank you for your response!
        </div>
        <div>
          <a href="/" className="text-blue-500 hover:text-accent transition-colors">Back to home</a>
        </div>
      </div>
    );
  }

  const form = (
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
            unansweredQuestionWarnings={unansweredQuestionWarnings}
          />
        </div>);
      })}
      <div className="w-full flex justify-center">
        <button
          onClick={() => submit(response.current)}
          className="blue-button mt-4 !px-12"
        >
          Submit
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex justify-center w-full">
        {form}
      </div>
      {!error || <div className="text-red-500 flex justify-center w-full">{error}</div>}
    </>
  );
}
