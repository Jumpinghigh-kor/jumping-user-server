import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { MemberExerciseGoalService } from './member-exercise-goal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InsertMemberExerciseGoalDto, UpdateMemberExerciseGoalDto, GetMemberExerciseGoalDto, MemberExerciseGoalResponse } from './dto/member-exercise-goal.dto';

@Controller('member-exercise-goal')
@UseGuards(JwtAuthGuard)
export class MemberExerciseGoalController {
  constructor(private readonly memberExerciseGoalService: MemberExerciseGoalService) {}

  @Post('insertMemberExerciseGoal')
  async insertMemberExerciseGoal(
    @Body() insertMemberExerciseGoalDto: InsertMemberExerciseGoalDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberExerciseGoalService.insertMemberExerciseGoal(insertMemberExerciseGoalDto);
  }

  @Post('updateMemberExerciseGoal')
  async updateMemberExerciseGoal(
    @Body() updateMemberExerciseGoalDto: UpdateMemberExerciseGoalDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberExerciseGoalService.updateMemberExerciseGoal(updateMemberExerciseGoalDto);
  }

  @Post('getMemberExerciseGoal')
  async getMemberExerciseGoal(
    @Body() getMemberExerciseGoalDto: GetMemberExerciseGoalDto
  ): Promise<{ success: boolean; data: MemberExerciseGoalResponse | null; code: string }> {
    return this.memberExerciseGoalService.getMemberExerciseGoal(getMemberExerciseGoalDto);
  }
} 