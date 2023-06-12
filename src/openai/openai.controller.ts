import { Body, Controller, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';

@Controller()
export class OpenAiController {
  constructor(private httpService: HttpService) {}

  @Post('/openai')
  async openAI(
    @Body() body: { messages: Array<{ role: string; content: string }> },
  ) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      'Content-Type': 'application/json',
    };

    try {
      const openAIResponse = await this.httpService
        .post(url, body, { headers })
        .pipe(map((response) => response.data))
        .toPromise();
      return openAIResponse;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    }
  }
}
