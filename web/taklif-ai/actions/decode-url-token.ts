"use server";

import { currentUser } from '@/lib/auth/auth';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
export async function decodeUrlToken(token: string) {

    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    if (!token) {
        return { error: 'Missing required token' }
    }

    try {
        const decoded = jwt.verify(token, secret as string);
        const { run_id } = decoded as { run_id: string };
        return { run_id };
    } catch (error) {
        console.log(error);
        return { error: 'Failed to decode token' };
    }
}