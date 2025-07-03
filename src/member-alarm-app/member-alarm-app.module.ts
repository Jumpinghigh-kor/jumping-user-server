import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberAlarmAppController } from './member-alarm-app.controller';
import { MemberAlarmAppService } from './member-alarm-app.service';
import { MemberAlarmApp } from '../entities/member-alarm-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberAlarmApp]),
  ],
  controllers: [MemberAlarmAppController],
  providers: [MemberAlarmAppService],
})
export class MemberAlarmAppModule {} 