"use server";
import { currentUser } from "@/lib/auth/auth";
import { client } from "@/lib/database/dynamo-client";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_update } from "@/auth";

export const decrementRemainingCredit = async () => {

  const user = await currentUser();



  if (!user) {
    return { error: "Unauthorized" };
  }

  const params = {
    TableName: "next-auth",
    Key: {
      pk: user.id as string,
      sk: user.id as string,
    },
    UpdateExpression:
      "SET subscription.remaining_credits = subscription.remaining_credits - :val",
    ConditionExpression:
      "attribute_exists(subscription) AND subscription.remaining_credits > :zero",
    ExpressionAttributeValues: {
      ":val": 1,
      ":zero": 0,
    },
  };
  try {
    await client.send(new UpdateCommand(params));

    if (user.remaining_credits) {
      const value = user.remaining_credits - 1;

      await unstable_update({
        user: {
          remaining_credits: value,
        },
      });

    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Error decrementing credits!" };
  }
};
