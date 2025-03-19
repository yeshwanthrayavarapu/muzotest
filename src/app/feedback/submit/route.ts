export async function POST(request: Request) {
  const error = (message: string) =>
    new Response(message, {
      status: 400,
    });

  try {
    const submission = await request.json();

    if (submission.attachedData) {
      submission.attachedData.playUrl = undefined;
    }

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
