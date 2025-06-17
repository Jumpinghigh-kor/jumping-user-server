import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { MemberPointAppService } from './member-point-app.service';
import { GetMemberPointAppListDto } from './dto/member-point-app.dto';

@Controller('member-point-app')
export class MemberPointAppController {
  constructor(
    private readonly memberPointAppService: MemberPointAppService,
  ) {}

  @Post('/getMemberPointAppList')
  getMemberPointAppList(@Body() getMemberPointAppListDto: GetMemberPointAppListDto) {
    return this.memberPointAppService.getMemberPointAppList(getMemberPointAppListDto.mem_id, getMemberPointAppListDto.reg_ym);
  }
} 