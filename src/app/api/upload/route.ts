import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`,
  },
});

export async function POST(request:NextRequest) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ message: 'Missing file name or type' }, { status: 400 });
    }

    const putObjectParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(putObjectParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error creating pre-signed URL:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}