import { SurveyResponse } from "../response";
import { QuestionData, QuestionResponse, QuestionType} from "../types";
import { Stars } from "./Stars";

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

  const setInitialResponse = (r: QuestionResponse) => {
    if (response.currentResponse(question)) return;
    response.addQuestionReponse(question, r);
  };

  switch (question.type) {
    case QuestionType.Text: {
      return <textarea 
        className="bg-gray-50 w-4/5 text-gray-900 p-2 text-sm rounded-lg"
        onChange={(e) => changeResponse(e.target.value)} 
      />;
    }
    case QuestionType.Number: {
      setInitialResponse(1);
      return <Stars setStarsAction={(n) => changeResponse(n)} />;
    }
    case QuestionType.Select: {
      let options = question.options ?? ["No", "Yes"];

      setInitialResponse(options[0]);

      return (
        <select 
          className="bg-gray-50 text-gray-900 p-2 rounded-lg w-fit min-w-[150px]"
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
