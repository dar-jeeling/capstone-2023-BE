import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { unlink } from 'fs/promises';
import { File, diskStorage } from 'multer';
import * as path from 'path';
import { ImageService } from './image.service';

const storageOptions = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + '-' + uniqueSuffix);
  },
});

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', { storage: storageOptions }))
  async uploadImage(@UploadedFile() file: File, @Res() res: Response) {
    const inputFilePath = file.path;
    const fileExtension = path.extname(file.originalname);
    const outputFilePath = 'processed_' + file.filename + fileExtension;

    try {
      await this.imageService.processImage(inputFilePath, outputFilePath);

      // 파일 다운로드와 삭제 로직
      res.download(outputFilePath, async (err) => {
        if (err) {
          console.error('Error sending file:', err);
          return res.status(500).json({ message: 'Image download failed' });
        }

        // Clean up temporary files
        await unlink(inputFilePath);
        await unlink(outputFilePath);
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
