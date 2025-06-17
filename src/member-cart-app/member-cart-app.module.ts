import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberCartAppController } from './member-cart-app.controller';
import { MemberCartAppService } from './member-cart-app.service';
import { MemberCartApp } from './dto/member-cart-app.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberCartApp]),
  ],
  controllers: [MemberCartAppController],
  providers: [MemberCartAppService],
})
export class MemberCartAppModule {} 