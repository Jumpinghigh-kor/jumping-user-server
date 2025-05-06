import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberZzimAppController } from './member-zzim-app.controller';
import { MemberZzimAppService } from './member-zzim-app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([])
  ],
  controllers: [MemberZzimAppController],
  providers: [MemberZzimAppService],
})
export class MemberZzimAppModule {} 