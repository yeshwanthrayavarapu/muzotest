import { SurveyResponse } from "../response";

export async function POST(request: Request) {
  const error = (message: string) =>
    new Response(message, {
      status: 400,
    });

  try {
    const submission = new SurveyResponse().fromJSON(await request.text());

    if (!submission.time) return error("Invalid submission time");

    // TODO: Store the submission
    console.log(submission);

    return new Response("Post submitted!", {
      status: 200,
    });
  } catch (e: any) {
    console.error(e);
    error(e?.message);
  }
}
