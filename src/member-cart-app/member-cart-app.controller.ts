import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MemberCartAppService } from './member-cart-app.service';
import { DeleteMemberCartAppDto, GetMemberCartAppListDto, UpdateMemberCartAppDto } from './dto/member-cart-app.dto';
import { MemberCartAppListResponse } from './dto/member-cart-app.dto';

@Controller('member-cart-app')
@UseGuards(JwtAuthGuard)
export class MemberCartAppController {
  constructor(private readonly memberCartAppService: MemberCartAppService) {}

  @Post('getMemberCartAppList')
  async getMemberCartAppList(
    @Body() getMemberCartAppListDto: GetMemberCartAppListDto
  ): Promise<{ success: boolean; data: MemberCartAppListResponse[] | null; code: string }> {
    return this.memberCartAppService.getMemberCartAppList(getMemberCartAppListDto);
  }
  
  @Post('insertMemberCartApp')
  async insertMemberCartApp(
    @Body() cartData: any
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberCartAppService.insertMemberCartApp(cartData);
  }

  @Post('deleteMemberCartApp')
  async deleteMemberCartApp(
    @Body() deleteMemberCartAppDto: DeleteMemberCartAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberCartAppService.deleteMemberCartApp(deleteMemberCartAppDto);
  }

  @Post('updateMemberCartApp')
  async updateMemberCartApp(
    @Body() updateMemberCartAppDto: UpdateMemberCartAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberCartAppService.updateMemberCartApp(updateMemberCartAppDto);
  }
} 