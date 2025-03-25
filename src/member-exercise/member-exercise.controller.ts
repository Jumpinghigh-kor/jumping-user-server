import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MemberExerciseService } from './member-exercise.service';
import { InsertMemberExerciseDto, GetMemberExerciseInfoDto, MemberExerciseInfoResponse, UpdateMemberExerciseDto, GetMemberExerciseListDto, MemberExerciseListResponse } from './dto/member-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('member-exercise')
@UseGuards(JwtAuthGuard)
export class MemberExerciseController {
  constructor(private readonly memberExerciseService: MemberExerciseService) {}

  @Post('insertMemberExercise')
  async insertMemberExercise(
    @Body() insertMemberExerciseDto: InsertMemberExerciseDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberExerciseService.insertMemberExercise(insertMemberExerciseDto);
  }

  @Post('updateMemberExercise')
  async updateMemberExercise(
    @Body() updateMemberExerciseDto: UpdateMemberExerciseDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberExerciseService.updateMemberExercise(updateMemberExerciseDto);
  }

  @Post('getMemberExerciseInfo')
  async getMemberExerciseInfo(
    @Body() getMemberExerciseInfoDto: GetMemberExerciseInfoDto
  ): Promise<{ success: boolean; data: MemberExerciseInfoResponse | null; code: string }> {
    return this.memberExerciseService.getMemberExerciseInfo(getMemberExerciseInfoDto);
  }

  @Post('getMemberExerciseList')
  async getMemberExerciseList(
    @Body() getMemberExerciseListDto: GetMemberExerciseListDto
  ): Promise<{ success: boolean; data: MemberExerciseListResponse[] | null; code: string }> {
    return this.memberExerciseService.getMemberExerciseList(getMemberExerciseListDto);
  }
} 