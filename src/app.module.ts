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
import { CheckinLogModule } from './checkin-log/checkin-log.module';
import { MemberOrdersModule } from './member-orders/member-orders.module';
import { MemberModule } from './member/member.module';
import { MemberExerciseModule } from './member-exercise/member-exercise.module';

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
      entities: [Member, CheckinLog, MemberExercise],
      synchronize: false, // 데이터 보존을 위해 false로 설정
    }),
    AuthModule,
    UsersModule,
    CheckinLogModule,
    MemberOrdersModule,
    MemberModule,
    MemberExerciseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
