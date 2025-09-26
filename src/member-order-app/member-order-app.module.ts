import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberOrderAppController } from './member-order-app.controller';
import { MemberOrderAppService } from './member-order-app.service';
import { AuthModule } from '../auth/auth.module';
import { MemberOrderApp } from '../entities/member-order-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberOrderApp]),
    AuthModule
  ],
  controllers: [MemberOrderAppController],
  providers: [MemberOrderAppService]
})
export class MemberOrderAppModule {} 