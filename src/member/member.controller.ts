import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { GetMemberInfoDto, MemberInfoResponse } from './dto/member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post('getMemberInfo')
  async getMemberInfo(
    @Body() getMemberInfoDto: GetMemberInfoDto
  ): Promise<{ success: boolean; data: MemberInfoResponse | null; code: string }> {
    return this.memberService.getMemberInfo(getMemberInfoDto);
  }
} 