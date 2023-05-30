import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import { unlink } from 'fs/promises';
import * as AWS from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { promises as fs } from 'fs';
import { String } from 'aws-sdk/clients/cloudtrail';

const { S3_BUCKET_NAME, AWS_REGION } = process.env;

// 파이썬 스크립트에서 반환된 라벨 인덱스를 이용해 라벨 이름 찾기
const LABELS: Array<string> = [
  'Adidas (아디다스)',
  'Apple (애플)',
  'BMW (비엠더블유)',
  'Citroen (시트로엥)',
  'Cocacola (코카콜라)',
  'DHL',
  'FedEx (페덱스)',
  'Ferrari (페라리)',
  'Ford (포드)',
  'Google (구글)',
  'Heineken (하이네켄)',
  'HP',
  'Intel (인텔)',
  'McDonalds (맥도날드)',
  'Mini (미니)',
  'NBC (National Broadcasting Company)',
  'Nike (나이키)',
  'Pepsi (펩시)',
  'Porsche (포르쉐)',
  'Puma (퓨마)',
  'RedBull (레드불)',
  'Sprite (스프라이트)',
  'Starbucks (스타벅스)',
  'Texaco (텍사코)',
  'Unicef (유니세프)',
  'Vodafone (보다폰)',
  'Yahoo (야후)',
];

const pythonScript = path.join(
  __dirname,
  '..',
  '..',
  'python-scripts',
  'image_processing.py',
);

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
  ): Promise<{ imageUrl: string; result: string }> {
    // 파이썬 스크립트 실행
    const cmd = `python3 ${pythonScript} ${inputFilePath} ${outputFilePath}`;
    const output = await this.execCmd(cmd);

    const parts = output.split(',');
    const result = parts[parts.length - 1];

    const label = LABELS[parseInt(result)];

    // S3 업로드 후 URL 반환
    const s3Url = await this.uploadToS3(outputFilePath);

    return {
      imageUrl: s3Url,
      result: label,
    };
  }

  execCmd(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout.trim());
        }
      });
    });
  }

  async uploadToS3(filePath: string): Promise<string> {
    // your AWS upload logic here
    // return the url after the upload is complete
    const fileContent = await fs.readFile(filePath);

    // Setting up S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filePath, // File name you want to save as in S3
      Body: fileContent,
      ACL: 'public-read', // your files in S3 will be publicly accessible
    };

    // console.log(params);

    // Uploading files to the bucket
    const command = new PutObjectCommand(params);
    await this.s3.send(command);

    const s3FileURL = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return s3FileURL;
  }
}
