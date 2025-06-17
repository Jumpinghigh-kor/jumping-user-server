import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberPointAppController } from './member-point-app.controller';
import { MemberPointAppService } from './member-point-app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [MemberPointAppController],
  providers: [MemberPointAppService],
  exports: [MemberPointAppService],
})
export class MemberPointAppModule {} 