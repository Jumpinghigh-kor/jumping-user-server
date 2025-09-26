import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InquiryShoppingAppService } from './inquiry-shopping-app.service';
import { GetInquiryShoppingAppListDto, InsertInquiryShoppingAppDto, InquiryShoppingAppListResponse, UpdateInquiryShoppingAppDto, DeleteInquiryShoppingAppDto } from './dto/inquiry-shopping-app.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('inquiry-shopping-app')
@UseGuards(JwtAuthGuard)
export class InquiryShoppingAppController {
  constructor(
    private readonly inquiryShoppingAppService: InquiryShoppingAppService,
  ) {}

  @Post('getInquiryShoppingAppList')
  async getInquiryAppList(
    @Body() getInquiryAppListDto: GetInquiryShoppingAppListDto
  ): Promise<{ success: boolean; data: InquiryShoppingAppListResponse[] | null; code: string }> {
    return this.inquiryShoppingAppService.getInquiryShoppingAppList(getInquiryAppListDto);
  }

  @Post('insertInquiryShoppingApp')
  async insertInquiryApp(
    @Body() insertInquiryShoppingAppDto: InsertInquiryShoppingAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.inquiryShoppingAppService.insertInquiryShoppingApp(insertInquiryShoppingAppDto);
  }

  @Post('updateInquiryShoppingApp')
  async updateInquiryShoppingApp(
    @Body() updateInquiryShoppingAppDto: UpdateInquiryShoppingAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.inquiryShoppingAppService.updateInquiryShoppingApp(updateInquiryShoppingAppDto);
  }

  @Post('deleteInquiryShoppingApp')
  async deleteInquiryShoppingApp(
    @Body() deleteInquiryShoppingAppDto: DeleteInquiryShoppingAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.inquiryShoppingAppService.deleteInquiryShoppingApp(deleteInquiryShoppingAppDto);
  }
}