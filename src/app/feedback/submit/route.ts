import { executeQuery } from "@/app/lib/db";
import * as sql from 'mssql';

export async function POST(request: Request) {
  const error = (message: string) =>
    new Response(message, {
      status: 400,
    });

  try {
    const submission = await request.json();

    // HACK: This is not needed and takes up a lot of data
    if (submission?.attachedData?.playUrl) {
      delete submission.attachedData.playUrl;
    }

    console.log(submission);

    executeQuery("INSERT INTO SurveyResponses (response) VALUES @response", [
      { name: "response", value: JSON.stringify(submission), type: sql.VarChar(8000) },
    ]);

    return new Response("Success", {
      status: 200,
    });
  } catch (e: any) {
    console.error(e);
    error(e?.message);
  }
}
