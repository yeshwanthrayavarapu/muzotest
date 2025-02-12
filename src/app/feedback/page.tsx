"use client";

import { SurveyResponse } from "./response";
import { useState } from "react";
import Form from "./components/Form";

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unansweredQuestionWarnings, setUnansweredQuestionWarnings] = useState<string[]>([]);

  const submit = async (surveyResponse: SurveyResponse) => {
    const missingQuestions = surveyResponse.missingNonOptionalQuestions();
    if (missingQuestions.length > 0) {
      setUnansweredQuestionWarnings(missingQuestions);
      setError("Please answer all required questions.");
      return;
    }

    const response = await fetch("/feedback/submit", {
      method: "POST",
      body: JSON.stringify(surveyResponse),
    });

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
          <a href="/" className="text-blue-500 hover:text-cyan-400 transition-colors">Back to home</a>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="flex justify-center w-full">
      <Form 
        submitAction={submit}
        unasweredQuestionWarnings={unansweredQuestionWarnings}
      />
    </div>
    {!error || <div className="text-red-500 flex justify-center w-full">{error}</div>}
    </>
  );
}
