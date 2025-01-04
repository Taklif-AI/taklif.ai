import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/lib/schemas/login-schema";
import { getUserByEmail } from "@/data/user";
export default {
    providers: [
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
    pages:{
        signIn:'/auth/sign-in',
    }
} satisfies NextAuthConfig
