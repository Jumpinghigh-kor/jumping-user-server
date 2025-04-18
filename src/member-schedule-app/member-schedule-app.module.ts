import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberScheduleAppController } from './member-schedule-app.controller';
import { MemberScheduleAppService } from './member-schedule-app.service';
import { MemberSchedule } from '../entities/member-schedule-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MemberSchedule
    ])
  ],
  controllers: [MemberScheduleAppController],
  providers: [MemberScheduleAppService],
  exports: [MemberScheduleAppService]
})
export class MemberScheduleAppModule {} 