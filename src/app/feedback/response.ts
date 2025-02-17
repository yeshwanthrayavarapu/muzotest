import { QuestionData, QuestionResponse, QuestionType } from "./types";

export class SurveyResponse {
  time: Date;
  questionResponses: Record<string, QuestionResponse>;

  constructor(questionList?: QuestionData[]) {
    this.time = new Date();
    this.questionResponses = {};

    if (questionList) {
      for (const question of questionList) {
        const response = defaultResponse(question);
        if (response !== undefined) {
          this.addQuestionReponse(question, response);
        }
      }
    }
  }

  addQuestionReponse(question: QuestionData, response: QuestionResponse) {
    this.questionResponses[question.description] = response;
  }

  /** @returns descriptions of unanswered non optional questions */
  missingNonOptionalQuestions(questionList: QuestionData[]): string[] {
    return questionList
      .filter((q) => !q.optional && !this.isHidden(q, questionList))
      .map((q) => q.description)
      .filter((d) => this.questionResponses[d] === undefined);
  }

  isHidden(question: QuestionData, questionList: QuestionData[]): boolean {
    if (question.dependant === undefined) return false;

    return this.questionResponses[dependantDescription(question, questionList) ?? ""] !==
      question.dependant.value;
  }

  fromJSON(json: string): SurveyResponse {
    let obj = JSON.parse(json);
    this.time = new Date(obj.time);
    this.questionResponses = obj.questionResponses;
    return this;
  }

  currentResponse(question: QuestionData): QuestionResponse | null {
    return this.questionResponses[question.description] ?? null;
  }
}

function defaultResponse(question: QuestionData): QuestionResponse |  undefined {
  switch (question.type) {
    case QuestionType.Text:
      return undefined;
    case QuestionType.Number:
      return 1;
    case QuestionType.Select:
      return question?.options?.[0] ?? "No";
  }
}

export function dependantDescription(question: QuestionData, questionList: QuestionData[]): string | null {
  if (!question.dependant) return null;

  let tag = question.dependant.tag;

  let dependantQuestion = questionList.find((q) => q.tag === tag);
  if (dependantQuestion) {
    return dependantQuestion.description;
  }

  return null;
}
