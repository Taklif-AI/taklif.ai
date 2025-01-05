import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/lib/schemas/login-schema";
import { getUserByEmail } from "@/data/user";
import Google from 'next-auth/providers/google';
export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedData = LoginSchema.safeParse(credentials);
                if (validatedData.success) {
                    const { email, password } = validatedData.data;

                    const user = await getUserByEmail(email);

                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );
                    if (passwordsMatch) {
                        user.id = user.pk
                        return user;
                    }
                }
                return null;
            }
        })
    ],
} satisfies NextAuthConfig
