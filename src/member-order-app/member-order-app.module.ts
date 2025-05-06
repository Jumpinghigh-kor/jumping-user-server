import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberOrderAppController } from './member-order-app.controller';
import { MemberOrderAppService } from './member-order-app.service';
import { Member } from '../entities/member.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    AuthModule
  ],
  controllers: [MemberOrderAppController],
  providers: [MemberOrderAppService]
})
export class MemberOrderAppModule {} 