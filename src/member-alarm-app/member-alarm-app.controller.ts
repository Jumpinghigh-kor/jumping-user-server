import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MemberAlarmAppService } from './member-alarm-app.service';
import { GetMemberAlarmAppDto } from './dto/member-alarm-app.dto';
import { MemberAlarmAppListResponse } from './dto/member-alarm-app.dto';
import { UpdatePushTokenDto, UpdatePushYnDto } from 'src/member/dto/member.dto';

@Controller('member-alarm-app')
@UseGuards(JwtAuthGuard)
export class MemberAlarmAppController {
  constructor(private readonly memberAlarmAppService: MemberAlarmAppService) {}

  @Post('getMemberAlarmAppList')
  async getMemberAlarmAppList(
    @Body() getMemberAlarmAppDto: GetMemberAlarmAppDto
  ): Promise<{ success: boolean; data: MemberAlarmAppListResponse[] | null; code: string }> {
    return this.memberAlarmAppService.getMemberAlarmAppList(getMemberAlarmAppDto);
  }

  @Post('insertMemberAlarmApp')
  async insertMemberAlarmApp(
    @Body() alarmData: any
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberAlarmAppService.insertMemberAlarmApp(alarmData);
  }

  @Post('updatePushToken')
  async updatePushToken(
    @Body() updatePushTokenDto: UpdatePushTokenDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberAlarmAppService.updatePushToken(updatePushTokenDto.mem_id, updatePushTokenDto.push_token);
  }

  @Post('updatePushYn')
  async updatePushYn(
    @Body() updatePushYnDto: UpdatePushYnDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberAlarmAppService.updatePushYn(updatePushYnDto.mem_id, updatePushYnDto.push_yn);
  }
} 