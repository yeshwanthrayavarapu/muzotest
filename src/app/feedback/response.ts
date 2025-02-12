import { QUESTIONS } from "./questions";
import { QuestionData, QuestionResponse } from "./types";

export class SurveyResponse {
  time: Date;
  questionResponses: Record<string, QuestionResponse>;

  constructor() {
    this.time = new Date();
    this.questionResponses = {};
  }

  addQuestionReponse(question: QuestionData, response: QuestionResponse) {
    this.questionResponses[question.description] = response;
  }

  /** @returns descriptions of unanswered non optional questions*/
  missingNonOptionalQuestions(): string[] {
    return QUESTIONS
      .filter((q) => !q.optional && !this.isHidden(q))
      .map((q) => q.description)
      .filter((d) => this.questionResponses[d] === undefined);
  }

  isHidden(question: QuestionData): boolean {
    if (question.dependant === undefined) return false;

    return this.questionResponses[dependantDescription(question) ?? ""] !==
      question.dependant.value;
  }

  fromJSON(json: string): SurveyResponse {
    let obj = JSON.parse(json);
    for (let key in obj) {
      this.questionResponses[key] = obj[key];
    }
    return this;
  }

  currentResponse(question: QuestionData): QuestionResponse | null {
    return this.questionResponses[question.description] ?? null;
  }
}

export function dependantDescription(question: QuestionData): string | null {
  if (!question.dependant) return null;

  let tag = question.dependant.tag;

  let dependantQuestion = QUESTIONS.find((q) => q.tag === tag);
  if (dependantQuestion) {
    return dependantQuestion.description;
  }

  return null;
}
