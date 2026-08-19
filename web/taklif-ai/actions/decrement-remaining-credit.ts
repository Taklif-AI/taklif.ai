"use server";
import { currentUser } from "@/lib/auth/auth";
import { client } from "@/lib/database/dynamo-client";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { unstable_update } from "@/auth";

export const decrementRemainingCredit = async () => {
  console.log(">>> DECREMENT: BEFORE CURRENT USER");

  const user = await currentUser();

  console.log(">>> DECREMENT: AFTER CURRENT USER", !!user);


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
    console.log(">>> DECREMENT: BEFORE DYNAMODB");
    await client.send(new UpdateCommand(params));
    console.log(">>> DECREMENT: AFTER DYNAMODB");

    if (user.remaining_credits) {
      const value = user.remaining_credits - 1;

      console.log(">>> DECREMENT: BEFORE UNSTABLE UPDATE");
      await unstable_update({
        user: {
          remaining_credits: value,
        },
      });
      console.log(">>> DECREMENT: AFTER UNSTABLE UPDATE");

    }

    return { success: true };
  } catch (error) {
    console.error(">>> DECREMENT ERROR:", error);
    console.log(error);
    return { error: "Error decrementing credits!" };
  }
};
