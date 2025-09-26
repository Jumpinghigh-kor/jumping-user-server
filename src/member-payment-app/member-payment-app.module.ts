import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberPaymentAppController } from './member-payment-app.controller';
import { MemberPaymentAppService } from './member-payment-app.service';
import { MemberPaymentApp } from '../entities/member-payment-app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberPaymentApp]),
    AuthModule
  ],
  controllers: [MemberPaymentAppController],
  providers: [MemberPaymentAppService]
})
export class MemberPaymentAppModule {} 