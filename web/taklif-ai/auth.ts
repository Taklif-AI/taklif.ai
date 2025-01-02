import NextAuth from "next-auth"
import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
import { client } from '@/lib/database/dynamo-client';
import authConfig from "@/auth.config";
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DynamoDBAdapter(client),
    session: { strategy: "jwt" },
    ...authConfig,

})