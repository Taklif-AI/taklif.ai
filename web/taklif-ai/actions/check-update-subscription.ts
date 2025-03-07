"use server";

import { getUserById, updateUserDynamicData } from "@/data/user";
import { currentUser } from "@/lib/auth/auth";


export const checkAndRenewSubscription = async () => {
    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized" };
    }
    const dbUser = await getUserById(user.id as string);

    if (!dbUser) {
        return { error: "User not found!" };
    }

    const subscription = dbUser.subscription;
    const subscriptionDate = new Date(subscription.subscription_date) || "1970-01-01T00:00:00.000Z";
    const currentDate = new Date();

    if (!subscription.subscription_date) {
        return { error: "Subscription date is missing." };
    }

    const timeDifference = currentDate.getTime() - subscriptionDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference > 30) {
        try {
            await updateUserDynamicData(user.id as string, {
                subscription: {
                    plan: "free",
                    plan_credits: 60,
                    remaining_credits: 60,
                    subscription_date: new Date().toISOString(),
                },
            })
            return { renewed: true, message: 'Subscription renewed successfully.' }
        } catch (error) {
            console.error("Error renewing subscription:", error);
            return { error: "Failed to renew subscription." };
        }
    } else {
        return { subscription: subscription }
    }
}