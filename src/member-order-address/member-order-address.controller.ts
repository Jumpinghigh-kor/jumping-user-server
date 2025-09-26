import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MemberOrderAddressService } from './member-order-address.service';
import { InsertMemberOrderAddressDto } from './dto/member-order-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('member-order-address')
@UseGuards(JwtAuthGuard)
export class MemberOrderAddressController {
  constructor(private readonly memberOrderAddressService: MemberOrderAddressService) {}

  @Post('insertMemberOrderAddress')
  async insertMemberOrderAddress(
    @Body() insertMemberOrderAddressDto: InsertMemberOrderAddressDto,
    @Body('mem_id') mem_id: number
  ): Promise<{ success: boolean; data: { order_address_id: number } | null; code: string }> {
    try {
      return this.memberOrderAddressService.insertMemberOrderAddress(insertMemberOrderAddressDto, mem_id);
    } catch (error) {
      throw error;
    }
  }
} 