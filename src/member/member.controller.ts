import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { GetMemberInfoDto, MemberInfoResponse, UpdateMemberAppPasswordDto } from './dto/member.dto';
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

  @Post('updateMemberAppPassword')
  async updateMemberAppPassword(
    @Body() updateMemberAppPasswordDto: UpdateMemberAppPasswordDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberService.updateMemberAppPassword(updateMemberAppPasswordDto);
  }

  @Post('checkNicknameDuplicate')
  async checkNicknameDuplicate(
    @Body() body: { mem_nickname: string }
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberService.checkNicknameDuplicate(body.mem_nickname);
  }

  @Post('completeSignup')
  async completeSignup(
    @Body() body: { mem_id: number, mem_nickname: string }
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberService.completeSignup(body);
  }
} 