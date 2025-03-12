import { SurveyResponse } from "./response";
import { QuestionData, QuestionResponse, QuestionType } from "@/types/feedback";
import { Stars } from "@/components/Stars";

interface Props {
  question: QuestionData;
  response: SurveyResponse;
  rerender: () => void;
}

export default function Feild(
  { question, response, rerender }: Props
) {
  const changeResponse = (r: QuestionResponse) => {
    response.addQuestionReponse(question, r);
    rerender();
  };

  switch (question.type) {
    case QuestionType.Text: {
      return <textarea 
        className="bg-container w-4/5 text-textPrimary p-2 text-sm rounded-lg"
        onChange={(e) => changeResponse(e.target.value)} 
      />;
    }
    case QuestionType.Number: {
      return <Stars setStarsAction={(n) => changeResponse(n)} />;
    }
    case QuestionType.Select: {
      let options = question.options ?? ["No", "Yes"];

      return (
        <select 
          className="bg-container text-textPrimary p-2 rounded-lg w-fit min-w-[150px]"
          onChange={(e) => changeResponse(e.target.value)}
        >
          {options.map((option) => (
            <option key={option} value={option} className="font-sans">
              {option}
            </option>
          ))}
        </select>
      );
    }
  }
}
