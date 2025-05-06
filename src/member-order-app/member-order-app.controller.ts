import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MemberOrderAppService } from './member-order-app.service';
import { GetMemberOrdersDto, MemberOrderAppResponse } from './dto/member-order-app.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';

@Controller('member-order-app')
@UseGuards(JwtAuthGuard)
export class MemberOrderAppController {
  constructor(private readonly memberOrderAppService: MemberOrderAppService) {}

  @Post('getMemberOrderAppList')
  async getMemberOrderAppList(
    @Body('mem_id') mem_id: string,
    @Body('screen_type') screen_type: string
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      return this.memberOrderAppService.getMemberOrderAppList(mem_id, screen_type);
    } catch (error) {
      throw error;
    }
  }
} 