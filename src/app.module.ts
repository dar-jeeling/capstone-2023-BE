import { Module } from '@nestjs/common';
import { ImageController } from './image/image.controller';
import { ImageService } from './image/image.service';
import { HttpModule } from '@nestjs/axios';
import { OpenAiController } from './openai/openai.controller';
import { Shop11stController } from './11st/11st.controller';
@Module({
  imports: [HttpModule],
  controllers: [ImageController, OpenAiController, Shop11stController],
  providers: [ImageService],
})
export class AppModule {}
