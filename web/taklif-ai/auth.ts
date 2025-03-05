import NextAuth, { type DefaultSession } from "next-auth";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { client } from "@/lib/database/dynamo-client";
import authConfig from "@/auth.config";
import { getUserById, updateUserFields } from "./data/user";
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
    institution: string | undefined;
    image?: string;
    s3Key?: string;
    theme: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      createdAt: string;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
      institution: string | undefined;
      image: string;
      s3Key: string;
      theme: string;
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
        await updateUserFields(
          user.id,
          "emailVerified",
          new Date().toISOString(),
          "createdAt",
          new Date().toISOString(),
        );
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      // prevent login if email is not verified yet
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.pk,
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmationfor next sign in process
        await deleteTwoFactorConfirmation(
          twoFactorConfirmation.pk,
          twoFactorConfirmation.sk,
        );
      }
      return true;
    },
    async session({ session, token }) {
      session.user.id = token.id as string; //extend the session with user id
      if (token.createdAt && session.user) {
        session.user.createdAt = token.createdAt;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.s3Key = token.s3Key as string;
        session.user.isOAuth = token.isOAuth;
        session.user.institution = token.institution || undefined;
        session.user.theme = token.theme;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        if (!user.id?.startsWith("USER")) {
          user.id = `USER#${user.id}`;
          token.id = user.id;
          token.sub = user.id;
        } else {
          token.id = user.id; // extend the token with user id
        }
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
      token.institution = existingUser.institution || undefined;
      token.createdAt = existingUser.createdAt;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.theme = existingUser.theme;
      return token;
    },
  },
  adapter: DynamoDBAdapter(client),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  ...authConfig,
});
