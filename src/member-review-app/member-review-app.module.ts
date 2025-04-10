import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberReviewAppController } from './member-review-app.controller';
import { MemberReviewAppService } from './member-review-app.service';
import { AuthModule } from '../auth/auth.module';
import { MemberReviewApp } from '../entities/member-review-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberReviewApp]),
    AuthModule
  ],
  controllers: [MemberReviewAppController],
  providers: [MemberReviewAppService]
})
export class MemberReviewAppModule {} 