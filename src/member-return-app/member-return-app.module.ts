import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberReturnAppController } from './member-return-app.controller';
import { MemberReturnAppService } from './member-return-app.service';
import { MemberReturnApp } from '../entities/member-return-app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberReturnApp]),
    AuthModule
  ],
  controllers: [MemberReturnAppController],
  providers: [MemberReturnAppService],
})
export class MemberReturnAppModule {} 