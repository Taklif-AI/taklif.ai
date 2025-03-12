import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from "@/data/verification-token";
import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetTokenByEmail,
} from "@/data/password-reset-token";
import {
  createTwoFactorToken,
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "@/data/two-factor-token";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

export const generateTwoFactorToken = async (email: string) => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    if (existingToken.expires > now) {
      throw new Error("A 2FA code has already been sent. Please wait until it expires before requesting another.");
    } else {
      await deleteTwoFactorToken(existingToken.pk, existingToken.sk);
    }
  }
  
  const tokenId = uuidv4();
  const token = crypto.randomInt(100000, 1000000).toString(); // 6 digits number
  const expires = now + 300; // expire the token in 1hour

  // Create a new two factor token record in the database
  const twoFactorToken = {
    pk: `TFT#${tokenId}`,
    sk: `TFT#${tokenId}`,
    GSI1PK: `TFT#${email}`,
    GSI1SK: `TFT#${email}`,
    email: email,
    token: token,
    expires: expires,
  };

  await createTwoFactorToken(twoFactorToken);
  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {

  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    if (existingToken.expires > now) {
      throw new Error("A reset email has already been sent. Please wait until it expires before requesting another.");
    } else {
      await deletePasswordResetToken(existingToken.pk, existingToken.sk);
    }
  }

  const token = uuidv4();
  const expires = now + 3600; // expire the token in 1hour

  // Create a new password reset token record in the database
  const passwordResetToken = {
    pk: `PR#${token}`,
    sk: `PR#${token}`,
    GSI1PK: `PR#${email}`,
    GSI1SK: `PR#${email}`,
    email: email,
    token: token,
    expires: expires,
  };

  await createPasswordResetToken(passwordResetToken);
  return passwordResetToken;
};

export const generateVerificationToken = async (
  email: string,
  old_email: string,
) => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    if (existingToken.expires > now) {
      throw new Error("A verification email has already been sent. Please wait until it expires before requesting another.");
    } else {
      await deleteVerificationToken(existingToken.pk, existingToken.sk);
    }
  }

  const token = uuidv4();
  const expires = now + 3600; // expire the token in 1hour

  // Create a new verification token record in the database
  const verificationToken = {
    pk: `VR#${token}`,
    sk: `VR#${token}`,
    GSI1PK: `VR#${email}`,
    GSI1SK: `VR#${email}`,
    email: email,
    old_email: old_email,
    token: token,
    expires: expires,
  };

  await createVerificationToken(verificationToken);
  return verificationToken;
};
