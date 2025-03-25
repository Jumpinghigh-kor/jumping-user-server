import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiryAppController } from './inquiry-app.controller';
import { InquiryAppService } from './inquiry-app.service';
import { InquiryApp } from '../entities/inquiry-app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InquiryApp]),
    AuthModule
  ],
  controllers: [InquiryAppController],
  providers: [InquiryAppService]
})
export class InquiryAppModule {} 