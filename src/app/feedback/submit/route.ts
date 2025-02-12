import { SurveyResponse } from "../response";

export async function POST(request: Request) {
  try {
    const submission = new SurveyResponse().fromJSON(await request.text());

    const error = (message: string) =>
      new Response(message, {
        status: 400,
      });

    if (!submission.time) return error("Invalid submission time");
    if (!submission.missingNonOptionalQuestions().length) return error("Please answer all required questions");

    // TODO: Store the submission
    console.log(submission);

    return new Response("Post submitted!", {
      status: 200,
    });
  } catch (e) {
    console.error(e);
  }
}
