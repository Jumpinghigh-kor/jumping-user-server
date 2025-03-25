import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InquiryAppService } from './inquiry-app.service';
import { GetInquiryAppListDto, InquiryAppListResponse, InsertInquiryAppDto, UpdateInquiryAppDto, DeleteInquiryAppDto } from './dto/inquiry-app.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('inquiry-app')
@UseGuards(JwtAuthGuard)
export class InquiryAppController {
  constructor(private readonly inquiryAppService: InquiryAppService) {}

  @Post('insertInquiryApp')
  async insertInquiryApp(
    @Body() insertInquiryAppDto: InsertInquiryAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.inquiryAppService.insertInquiryApp(insertInquiryAppDto);
  }

  @Post('updateInquiryApp')
  async updateInquiryApp(
    @Body() updateInquiryAppDto: UpdateInquiryAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.inquiryAppService.updateInquiryApp(updateInquiryAppDto);
  }

  @Post('getInquiryAppList')
  async getInquiryAppList(
    @Body() getInquiryAppListDto: GetInquiryAppListDto
  ): Promise<{ success: boolean; data: InquiryAppListResponse[] | null; code: string }> {
    return this.inquiryAppService.getInquiryAppList(getInquiryAppListDto);
  }

  @Post('deleteInquiryApp')
  async deleteInquiryApp(
    @Body() deleteInquiryAppDto: DeleteInquiryAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.inquiryAppService.deleteInquiryApp(deleteInquiryAppDto);
  }
} 