import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';

@Injectable()
export class ImageService {
  async processImage(
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<void> {
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
        (error) => {
          if (error) {
            console.error('Error executing Python script:', error);
            reject('Image processing failed');
          } else {
            resolve();
          }
        },
      );
    });
  }
}
