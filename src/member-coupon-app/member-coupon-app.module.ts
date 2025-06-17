import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberCouponAppController } from './member-coupon-app.controller';
import { MemberCouponAppService } from './member-coupon-app.service';
import { MemberCouponApp } from './dto/member-coupon-app.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberCouponApp]),
  ],
  controllers: [MemberCouponAppController],
  providers: [MemberCouponAppService],
})
export class MemberCouponAppModule {} 