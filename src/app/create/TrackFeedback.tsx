import { QuestionType, QuestionData } from "@/types/feedback";
import Feedback from "../feedback/Feedback";
import { X } from "lucide-react";
import { Track } from "@/types/music";

interface Props {
  closeAction: () => void;
  trackData: Track;
};

export default function TrackFeedback({ closeAction, trackData }: Props) {
  return <div className="fixed z-50 bg-background shadow-md top-0 right-0 p-10 min-w-[25rem] w-[50%] max-w-[50rem] overflow-y-scroll h-full">
    <button className="absolute top-4 left-4" onClick={closeAction}>
      <X size={27} />
    </button>
    <Feedback 
      questionList={QUESTIONS}
      attachedData={trackData}
      feedbackGroup="track-feedback"
    />
  </div>;
}

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
    tag: "instruments",
    description: "Did you request any specific instruments?",
    type: QuestionType.Select,
    optional: false,
    options: ["No", "Yes"],
  },
  {
    dependant: { tag: "instruments", value: "Yes" },
    description: "What instruments did you request?",
    type: QuestionType.Text,
    optional: false,
  },
  {
    dependant: { tag: "instruments", value: "Yes" },
    description: "How well was the requested instrument implemented?",
    type: QuestionType.Number,
    optional: false,
  },
  {
    tag: "genre",
    description: "Did you request any specific genres?",
    type: QuestionType.Select,
    optional: false,
    options: ["No", "Yes"],
  },
  {
    dependant: { tag: "genre", value: "Yes" },
    description: "What genres did you request?",
    type: QuestionType.Text,
    optional: false,
  },
  {
    dependant: { tag: "genre", value: "Yes" },
    description: "How close to the requested genre was the output?",
    type: QuestionType.Number,
    optional: false,
  },
];
