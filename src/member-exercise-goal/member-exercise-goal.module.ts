import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberExerciseGoalController } from './member-exercise-goal.controller';
import { MemberExerciseGoalService } from './member-exercise-goal.service';
import { MemberExerciseGoal } from '../entities/member-exercise-goal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberExerciseGoal
    ])
  ],
  controllers: [MemberExerciseGoalController],
  providers: [MemberExerciseGoalService],
  exports: [MemberExerciseGoalService]
})
export class MemberExerciseGoalModule {} 