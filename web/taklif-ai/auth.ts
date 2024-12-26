import NextAuth from "next-auth"
import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
import Credentials from "next-auth/providers/credentials"

const config: DynamoDBClientConfig = {
    credentials: {
        accessKeyId: process.env.AUTH_DYNAMODB_ID as string,
        secretAccessKey: process.env.AUTH_DYNAMODB_SECRET as string,
    },
    region: process.env.AUTH_DYNAMODB_REGION,
}

const client = DynamoDBDocument.from(new DynamoDB(config), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
})

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({

            authorize: async (credentials) => {
                // let user = null

                // logic to salt and hash password
                // const pwHash = saltAndHashPassword(credentials.password)

                // logic to verify if the user exists
                // user = await getUserFromDb(credentials.email, pwHash)

                // if (!user) {
                //     // No user found, so this is their first attempt to login
                //     // Optionally, this is also the place you could do a user registration
                //     throw new Error("Invalid credentials.")
                // }

                // return user object with their profile data
                // return user
            }
        })
    ],
    adapter: DynamoDBAdapter(client, {
        tableName: 'mt-table-name'
    }),
})