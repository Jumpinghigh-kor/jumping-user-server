import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MemberExerciseAppService } from './member-exercise-app.service';
import { InsertMemberExerciseAppDto, GetMemberExerciseAppInfoDto, MemberExerciseAppInfoResponse, UpdateMemberExerciseAppDto, GetMemberExerciseAppListDto, MemberExerciseAppListResponse } from './dto/member-exercise-app.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('member-exercise-app')
@UseGuards(JwtAuthGuard)
export class MemberExerciseAppController {
  constructor(private readonly memberExerciseAppService: MemberExerciseAppService) {}

  @Post('insertMemberExerciseApp')
  async insertMemberExerciseApp(
    @Body() insertMemberExerciseAppDto: InsertMemberExerciseAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberExerciseAppService.insertMemberExerciseApp(insertMemberExerciseAppDto);
  }

  @Post('updateMemberExerciseApp')
  async updateMemberExerciseApp(
    @Body() updateMemberExerciseAppDto: UpdateMemberExerciseAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberExerciseAppService.updateMemberExerciseApp(updateMemberExerciseAppDto);
  }

  @Post('getMemberExerciseAppInfo')
  async getMemberExerciseAppInfo(
    @Body() getMemberExerciseAppInfoDto: GetMemberExerciseAppInfoDto
  ): Promise<{ success: boolean; data: MemberExerciseAppInfoResponse | null; code: string }> {
    return this.memberExerciseAppService.getMemberExerciseAppInfo(getMemberExerciseAppInfoDto);
  }

  @Post('getMemberExerciseAppList')
  async getMemberExerciseAppList(
    @Body() getMemberExerciseAppListDto: GetMemberExerciseAppListDto
  ): Promise<{ success: boolean; data: MemberExerciseAppListResponse[] | null; code: string }> {
    return this.memberExerciseAppService.getMemberExerciseAppList(getMemberExerciseAppListDto);
  }
} 