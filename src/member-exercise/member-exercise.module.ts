import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberExerciseController } from './member-exercise.controller';
import { MemberExerciseService } from './member-exercise.service';
import { MemberExercise } from '../entities/member-exercise.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberExercise]),
    AuthModule
  ],
  controllers: [MemberExerciseController],
  providers: [MemberExerciseService]
})
export class MemberExerciseModule {} 