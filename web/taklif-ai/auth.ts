import NextAuth, { type DefaultSession } from "next-auth";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { client } from "@/lib/database/dynamo-client";
import authConfig from "@/auth.config";
import { getUserById, updateUserDynamicData } from "./data/user";
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "@/data/two-factor-confirmation";
import { JWT } from "next-auth/jwt";
import { getAccountByUserId } from "./data/account";

declare module "next-auth/jwt" {
  interface JWT {
    createdAt?: string;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    institution?: string;
    image?: string;
    s3Key?: string;
    theme: string;
    plan: string;
    plan_credits: number;
    remaining_credits: number;
    subscription_date: Date;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      createdAt: string;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
      institution?: string;
      image?: string;
      s3Key?: string;
      theme: string;
      plan: string;
      plan_credits: number;
      remaining_credits: number;
      subscription_date: Date;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) {
        user.id = `USER#${user.id}`;
        await updateUserDynamicData(user.id, {
          emailVerified: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          subscription: {
            plan: "free",
            plan_credits: 60,
            remaining_credits: 60,
            subscription_date: new Date().toISOString(),
          },
        });
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.pk,
        );
        if (!twoFactorConfirmation) return false;

        await deleteTwoFactorConfirmation(
          twoFactorConfirmation.pk,
          twoFactorConfirmation.sk,
        );
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.createdAt = token.createdAt || "";
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.name = token.name;
        session.user.email = token.email || "";
        session.user.image = token.image || "";
        session.user.s3Key = token.s3Key || "";
        session.user.isOAuth = token.isOAuth;
        session.user.institution = token.institution;
        session.user.theme = token.theme;
        session.user.plan = token.plan;
        session.user.plan_credits = token.plan_credits;
        session.user.remaining_credits = token.remaining_credits;
        session.user.subscription_date = token.subscription_date;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        if (!user.id?.startsWith("USER")) {
          user.id = `USER#${user.id}`;
        }
        token.id = user.id;
        token.sub = user.id;
      }

      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.pk);
      token.isOAuth = !!existingAccount;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.s3Key = existingUser.s3Key;
      token.institution = existingUser.institution;
      token.createdAt = existingUser.createdAt;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.theme = existingUser.theme;

      // Extracting `subscription` data correctly from the map
      token.plan = existingUser.subscription?.plan || "free";
      token.plan_credits = existingUser.subscription?.plan_credits;
      token.remaining_credits = existingUser.subscription?.remaining_credits;
      token.subscription_date = existingUser.subscription?.subscription_date
        ? new Date(existingUser.subscription.subscription_date)
        : new Date();

      token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 10;
      return token;
    },
  },
  adapter: DynamoDBAdapter(client),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 10, // 10 days
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 10, // 10 days
  },
  ...authConfig,
});
