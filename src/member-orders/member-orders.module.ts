import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberOrdersController } from './member-orders.controller';
import { MemberOrdersService } from './member-orders.service';
import { Member } from '../entities/member.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    AuthModule
  ],
  controllers: [MemberOrdersController],
  providers: [MemberOrdersService]
})
export class MemberOrdersModule {} 