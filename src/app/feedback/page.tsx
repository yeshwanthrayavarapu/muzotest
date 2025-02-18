import { QUESTIONS } from "./questions";
import Feedback from "./components/Feedback";

export default function FullFeedbackPage() {
  return (
    <Feedback questionList={QUESTIONS} />
  )
}

