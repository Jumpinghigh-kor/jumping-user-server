import { Controller, Post, Body } from '@nestjs/common';
import { InquiryShoppingAppService } from './inquiry-shopping-app.service';
import { InsertInquiryShoppingAppDto } from './dto/inquiry-shopping-app.dto';

@Controller('inquiry-shopping-app')
export class InquiryShoppingAppController {
  constructor(
    private readonly inquiryShoppingAppService: InquiryShoppingAppService,
  ) {}

  @Post('/insertInquiryShoppingApp')
  insertInquiryShoppingApp(@Body() insertInquiryShoppingAppDto: InsertInquiryShoppingAppDto) {
    return this.inquiryShoppingAppService.insertInquiryShoppingApp(
      insertInquiryShoppingAppDto.mem_id,
      insertInquiryShoppingAppDto.product_app_id,
      insertInquiryShoppingAppDto.description
    );
  }

  // Methods will be added later
} 