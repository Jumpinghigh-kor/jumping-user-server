import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
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
import { MemberModule } from './member/member.module';
import { MemberExerciseModule } from './member-exercise/member-exercise.module';
import { NoticesAppModule } from './notices-app/notices-app.module';
import { InquiryAppModule } from './inquiry-app/inquiry-app.module';
import { UpdateLogAppModule } from './update-log-app/update-log-app.module';
import { CommonModule } from './common/common.module';
import { MemberImgFileModule } from './member-img-file/member-img-file.module';
import { RefreshToken } from './entities/refresh-token.entity';

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
      entities: [Member, CheckinLog, MemberExercise, Notice, NoticesApp, InquiryApp, RefreshToken],
      synchronize: false, // 데이터 보존을 위해 false로 설정
    }),
    AuthModule,
    UsersModule,
    CheckinLogModule,
    MemberOrdersModule,
    MemberModule,
    MemberExerciseModule,
    NoticesAppModule,
    InquiryAppModule,
    UpdateLogAppModule,
    CommonModule,
    MemberImgFileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
