"use server";

import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/lib/schemas/login-schema";
import { validateTurnstileToken } from "next-turnstile";
import {
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/lib/utils/mail";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/utils/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "@/data/two-factor-confirmation";
import { v4 as uuidv4 } from "uuid";

export async function login(formData: object, callbackUrl?: string | null) {
  const validateData = LoginSchema.safeParse(formData);

  // validate the user credentials
  if (!validateData.success) {
    const errors = validateData.error.errors.map((err) => err.message);
    return { error: errors[0] };
  }

  const token = formData.token;

  const validationResponse = await validateTurnstileToken({
    token,
    secretKey: process.env.TURNSTILE_SECRET_KEY!,
    idempotencyKey: uuidv4(),
    sandbox: process.env.NODE_ENV === "development",
  });

  if (!validationResponse.success) {
    console.error("Turnstile validation failed:", validationResponse);
    return { error: "Security check failed. Please try again!" };
  }

  const { email, password, code } = validateData.data;

  // check the email existence
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }
  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordsMatch) {
    return { error: "Invalid credentials!" };
  }
  // check the email verification
  if (!existingUser.emailVerified) {
    try {
      const verificationToken = await generateVerificationToken(
        existingUser.email,
        existingUser.email,
      );

      // send verification token email
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );

      return { success: "Confirmation email sent!" };
    } catch (error: any) {
      return { error: error.message }
    }
  }

  // check the two factor enabled or not
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    // if the user entered the code
    if (code) {
      // get the code from the DB
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      // check the code
      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const hasExpired = twoFactorToken.expires < currentTime;

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      // delete the token from DB
      await deleteTwoFactorToken(twoFactorToken.pk, twoFactorToken.sk);

      // get the last 2FA confirmation of the user
      const exisitingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.pk,
      );
      if (exisitingConfirmation) {
        await deleteTwoFactorConfirmation(
          exisitingConfirmation.pk,
          exisitingConfirmation.sk,
        );
      }

      // create a new confirmation
      const twoFactorConfirmationId = uuidv4();
      const towFactorConfirmation = {
        pk: `TFC#${twoFactorConfirmationId}`,
        sk: `TFC#${twoFactorConfirmationId}`,
        GSI1PK: existingUser.pk,
        GSI1SK: existingUser.sk,
      };

      await createTwoFactorConfirmation(towFactorConfirmation);
    } else {
      // if there is no code , generate and send a code
      try {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

        return { twoFactor: true };
      } catch (error: any) {
        return { error: error.message, twoFactor: true }
      }
    }
  }
  // begin the sign-in process
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          console.log(error);

          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}
