import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Member } from './entities/member.entity';
import { CheckinLog } from './entities/checkin-log.entity';
import { MemberExercise } from './entities/member-exercise.entity';
import { Notice } from './entities/notice.entity';
import { NoticesApp } from './entities/notices-app.entity';
import { InquiryApp } from './entities/inquiry-app.entity';
import { CheckinLogModule } from './checkin-log/checkin-log.module';
import { MemberOrdersModule } from './member-orders/member-orders.module';
import { MemberOrderAppModule } from './member-order-app/member-order-app.module';
import { MemberModule } from './member/member.module';
import { MemberExerciseModule } from './member-exercise/member-exercise.module';
import { NoticesAppModule } from './notices-app/notices-app.module';
import { InquiryAppModule } from './inquiry-app/inquiry-app.module';
import { UpdateLogAppModule } from './update-log-app/update-log-app.module';
import { MemberImgFileModule } from './member-img-file/member-img-file.module';
import { RefreshToken } from './entities/refresh-token.entity';
import { BannerAppModule } from './banner-app/banner-app.module';
import { BannerApp } from './entities/banner-app.entity';
import { ProductAppModule } from './product-app/product-app.module';
import { ProductApp } from './entities/product-app.entity';
import { MemberReviewAppModule } from './member-review-app/member-review-app.module';
import { MemberReviewApp } from './entities/member-review-app.entity';
import { MemberScheduleAppModule } from './member-schedule-app/member-schedule-app.module';
import { MemberSchedule } from './entities/member-schedule-app.entity';
import { CommonCodeModule } from './common-code/common-code.module';
import { MemberZzimAppModule } from './member-zzim-app/member-zzim-app.module';
import { MemberSearchAppModule } from './member-search-app/member-search-app.module';
import { MemberShippingAddressModule } from './member-shipping-address/member-shipping-address.module';
import { MemberExerciseGoalModule } from './member-exercise-goal/member-exercise-goal.module';
import { MemberCartAppModule } from './member-cart-app/member-cart-app.module';
import { MemberCartApp } from './member-cart-app/dto/member-cart-app.dto';
import { MemberPointAppModule } from './member-point-app/member-point-app.module';
import { MemberCouponAppModule } from './member-coupon-app/member-coupon-app.module';
import { NoticesShoppingAppModule } from './notices-shopping-app/notices-shopping-app.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'jumping',
      entities: [Member, CheckinLog, MemberExercise, Notice, NoticesApp, InquiryApp, RefreshToken, BannerApp, ProductApp, MemberReviewApp, MemberSchedule, MemberCartApp],
      synchronize: false, // 데이터 보존을 위해 false로 설정
    }),
    AuthModule,
    CheckinLogModule,
    MemberOrderAppModule,
    MemberOrdersModule,
    MemberModule,
    MemberExerciseModule,
    MemberExerciseGoalModule,
    NoticesAppModule,
    InquiryAppModule,
    UpdateLogAppModule,
    MemberImgFileModule,
    BannerAppModule,
    ProductAppModule,
    MemberReviewAppModule,
    MemberScheduleAppModule,
    CommonCodeModule,
    MemberZzimAppModule,
    MemberSearchAppModule,
    MemberShippingAddressModule,
    MemberCartAppModule,
    MemberPointAppModule,
    MemberCouponAppModule,
    NoticesShoppingAppModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
