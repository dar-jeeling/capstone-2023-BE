import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import { config } from 'dotenv';
import { XMLParser } from 'fast-xml-parser';

config();

@Controller('shop11st')
export class Shop11stController {
  @Get('item')
  async getItem(@Query('keyword') keyword: string) {
    const url = `http://openapi.11st.co.kr/openapi/OpenApiService.tmall?key=${process.env.SHOP_11ST_KEY}&apiCode=ProductSearch&keyword=${keyword}$&pageSize=10`;
    const parser = new XMLParser();

    try {
      const response = await axios.get(url);
      return parser.parse(response.data).ProductSearchResponse.Products;
      // return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
