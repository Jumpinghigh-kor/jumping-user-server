import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MemberPaymentAppService } from './member-payment-app.service';
import { GetMemberPaymentsDto, InsertMemberPaymentAppDto, MemberPaymentAppResponse } from './dto/member-payment-app.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';

@Controller('member-payment-app')
@UseGuards(JwtAuthGuard)
export class MemberPaymentAppController {
  constructor(private readonly memberPaymentAppService: MemberPaymentAppService) {}

  @Post('insertMemberPaymentApp')
  async insertMemberPaymentApp(
    @Body() insertMemberPaymentAppDto: InsertMemberPaymentAppDto
  ): Promise<{ success: boolean; data: { payment_app_id: number } | null; code: string }> {
    console.log(insertMemberPaymentAppDto);
    try {
      return this.memberPaymentAppService.insertMemberPaymentApp(insertMemberPaymentAppDto);
    } catch (error) {
      throw error;
    }
  }
} 