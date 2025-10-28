import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InquiryShoppingAppService } from './inquiry-shopping-app.service';
import { InsertInquiryShoppingAppDto } from './dto/inquiry-shopping-app.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('inquiry-shopping-app')
@UseGuards(JwtAuthGuard)
export class InquiryShoppingAppController {
  constructor(
    private readonly inquiryShoppingAppService: InquiryShoppingAppService,
  ) {}

  @Post('insertInquiryShoppingApp')
  async insertInquiryApp(
    @Body() insertInquiryShoppingAppDto: InsertInquiryShoppingAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.inquiryShoppingAppService.insertInquiryShoppingApp(insertInquiryShoppingAppDto);
  }
}