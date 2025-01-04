import NextAuth, { type DefaultSession } from "next-auth"
import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
import { client } from '@/lib/database/dynamo-client';
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        createdAt?: string
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            createdAt: string; // add a new field to the session object
        } & DefaultSession["user"]
    }
}

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id as string; //extend the session with user id
            if (token.createdAt && session.user) {
                session.user.createdAt = token.createdAt;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // extend the token with user id
            }
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;
            token.createdAt = existingUser.createdAt;

            return token;
        },
    },
    adapter: DynamoDBAdapter(client),
    session: { strategy: "jwt" },
    ...authConfig,
})