import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberExerciseAppController } from './member-exercise-app.controller';
import { MemberExerciseAppService } from './member-exercise-app.service';
import { MemberExerciseApp } from '../entities/member-exercise-app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberExerciseApp]),
    AuthModule
  ],
  controllers: [MemberExerciseAppController],
  providers: [MemberExerciseAppService]
})
export class MemberExerciseAppModule {} 