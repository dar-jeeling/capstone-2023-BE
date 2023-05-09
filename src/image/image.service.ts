import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import { promises as fs } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class ImageService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async processImage(
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<string> {
    const pythonScript = path.join(
      __dirname,
      '..',
      '..',
      'python-scripts',
      'image_processing.py',
    );

    return new Promise((resolve, reject) => {
      exec(
        `python3 ${pythonScript} ${inputFilePath} ${outputFilePath}`,
        async (error) => {
          if (error) {
            console.error('Error executing Python script:', error);
            reject('Image processing failed');
          } else {
            const fileContent = await fs.readFile(outputFilePath);

            // Setting up S3 upload parameters
            const params = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: outputFilePath, // File name you want to save as in S3
              Body: fileContent,
              ACL: 'public-read', // your files in S3 will be publicly accessible
            };

            console.log(params);

            // Uploading files to the bucket
            const command = new PutObjectCommand(params);
            await this.s3.send(command);

            const s3FileURL = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
            resolve(s3FileURL);
          }
        },
      );
    });
  }
}
