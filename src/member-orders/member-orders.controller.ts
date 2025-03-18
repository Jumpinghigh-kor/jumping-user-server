import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MemberOrdersService } from './member-orders.service';
import { GetMemberOrdersDto, MemberOrderResponse, UpdateMemberOrdersRemainingCntDto } from './dto/member-orders.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BadRequestException } from '@nestjs/common';

@Controller('member-orders')
@UseGuards(JwtAuthGuard)
export class MemberOrdersController {
  constructor(private readonly memberOrdersService: MemberOrdersService) {}

  @Post('getMemberOrdersList')
  async getMemberOrdersList(
    @Body() getMemberOrdersDto: GetMemberOrdersDto
  ): Promise<{ success: boolean; data: MemberOrderResponse[]; code: string }> {
    try {
      if (!getMemberOrdersDto.mem_id) {
        throw new BadRequestException('Missing required fields');
      }
      return this.memberOrdersService.getMemberOrdersList(getMemberOrdersDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('updateMemberOrdersRemainingCnt')
  async updateMemberOrdersRemainingCnt(
    @Body() updateRemainingCountDto: UpdateMemberOrdersRemainingCntDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberOrdersService.updateMemberOrdersRemainingCnt(updateRemainingCountDto);
  }
} 