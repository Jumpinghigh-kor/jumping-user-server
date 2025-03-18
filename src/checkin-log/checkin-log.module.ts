import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinLogController } from './checkin-log.controller';
import { CheckinLogService } from './checkin-log.service';
import { CheckinLog } from '../entities/checkin-log.entity';
import { Member } from '../entities/member.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CheckinLog, Member]),
    AuthModule
  ],
  controllers: [CheckinLogController],
  providers: [CheckinLogService]
})
export class CheckinLogModule {} 