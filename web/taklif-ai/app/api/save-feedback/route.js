import { client } from "@/lib/database/dynamo-assignment-client";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req) {
  const { PK, SK, feedback } = await req.json();

  if (!PK || !SK) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  try {
    const params = {
      TableName: "Development-AssignmentsTable",
      Key: {
        PK: PK,
        SK: SK,
      },
      UpdateExpression: "SET feedback = :feedback",
      ExpressionAttributeValues: {
        ":feedback": feedback,
      },
    };

    await client.send(new UpdateCommand(params));
    return new Response(
      JSON.stringify({ message: "Feedback saved successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to save feedback" }), {
      status: 500,
    });
  }
}
