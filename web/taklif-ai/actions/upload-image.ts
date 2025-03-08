"use server";

import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { currentUser } from "@/lib/auth/auth";
import { updateUserDynamicData } from "@/data/user";
import { unstable_update } from "@/auth";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
  region: process.env.S3_REGION,
});

export const uploadImage = async (filename: string, contentType: string) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  if (!contentType.startsWith("image/")) {
    return { error: "Only images are allowed" };
  }

  try {
    // Generate a unique key for the image file
    const s3Key = `user-profile-images/${uuidv4()}-${filename}`;

    // Generate presigned URL to allow client to upload to S3
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: s3Key,
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 5 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 600, // URL expiration time (600 seconds = 10 minutes)
    });

    const old_image_key = user.s3Key ? user.s3Key : null;

    if (old_image_key && old_image_key.startsWith("user-profile-images")) {
      const isDeleted = await deleteOldProfileImage(old_image_key);
      if (!isDeleted) {
        return { error: "Failed to upload image!11" };
      }
    }
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`;
    await updateUserDynamicData(user.id as string, {
      image: imageUrl,
      s3Key: s3Key,
    });
    await unstable_update({
      user: {
        image: imageUrl,
      },
    });
    return { url, fields, s3Key, imageUrl };
  } catch (error) {
    console.log(error);
    return { error: "Failed to upload image!22" };
  }
};

async function deleteOldProfileImage(s3Key: string) {
  try {
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
    return true;
  } catch (error) {
    console.error(`Error deleting old profile image: ${s3Key}`, error);
    return null;
  }
}
