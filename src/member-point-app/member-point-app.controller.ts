import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { MemberPointAppService } from './member-point-app.service';
import { GetMemberPointAppListDto } from './dto/member-point-app.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('member-point-app')
@UseGuards(JwtAuthGuard)
export class MemberPointAppController {
  constructor(
    private readonly memberPointAppService: MemberPointAppService,
  ) {}

  @Post('/getMemberPointAppList')
  getMemberPointAppList(@Body() getMemberPointAppListDto: GetMemberPointAppListDto) {
    return this.memberPointAppService.getMemberPointAppList(getMemberPointAppListDto.mem_id, getMemberPointAppListDto.reg_ym);
  }
} 