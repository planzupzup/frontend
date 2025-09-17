// app/api/upload-s3/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// AWS SDK v3를 사용하면 더 모던한 문법과 트리 쉐이킹을 지원합니다.
// .env.local 파일에 다음 환경 변수들을 설정해야 합니다.
// AWS_ACCESS_KEY_ID=...
// AWS_SECRET_ACCESS_KEY=...
// AWS_S3_REGION=...
// AWS_S3_BUCKET_NAME=...
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File; // 클라이언트에서 'file'이라는 이름으로 보낸 파일

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }
    
    // 파일의 내용을 Buffer로 변환
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueFileName = `${uuidv4()}-${file.name}`;

    const uploadParams = {
      Bucket: 'planzupzup',
      Key: uniqueFileName,
      Body: buffer,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // 업로드된 파일의 URL 생성
    const fileUrl = `https://planzupzup.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      url: fileUrl,
    });
    
  } catch (error) {
    console.error('파일 업로드 실패:', error);
    return NextResponse.json({ success: false, message: 'File upload failed.' }, { status: 500 });
  }
}