import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberShippingAddressController } from './member-shipping-address.controller';
import { MemberShippingAddressService } from './member-shipping-address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([])
  ],
  controllers: [MemberShippingAddressController],
  providers: [MemberShippingAddressService],
})
export class MemberShippingAddressModule {} 