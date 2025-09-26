import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberOrderAddressController } from './member-order-address.controller';
import { MemberOrderAddressService } from './member-order-address.service';
import { MemberOrderAddress } from '../entities/member-order-address.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberOrderAddress]),
    AuthModule
  ],
  controllers: [MemberOrderAddressController],
  providers: [MemberOrderAddressService]
})
export class MemberOrderAddressModule {} 