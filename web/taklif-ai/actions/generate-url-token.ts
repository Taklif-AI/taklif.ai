"use server";

import { currentUser } from '@/lib/auth/auth';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
export async function generateUrlToken(run_id: string, personalization_id: string) {

    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    if (!run_id || !personalization_id) {
        return { error: 'Missing required data' }
    }

    const payload = { run_id, personalization_id };
    try {
        const token = jwt.sign(payload, secret as string, { expiresIn: '24h' });
        return { token: token };
    } catch (error) {
        console.log(error);
        return { error: 'Failed to generate token' };
    }
}