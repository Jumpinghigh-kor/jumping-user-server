import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MemberShippingAddressService } from './member-shipping-address.service';
import { GetMemberShippingAddressListDto } from './dto/member-shipping-address.dto';

@UseGuards(JwtAuthGuard)
@Controller('member-shipping-address')
export class MemberShippingAddressController {
  constructor(private readonly memberShippingAddressService: MemberShippingAddressService) {}

  @Post('getMemberShippingAddressList')
  getMemberShippingAddressList(@Body() getMemberShippingAddressListDto: GetMemberShippingAddressListDto) {
    return this.memberShippingAddressService.getMemberShippingAddressList(getMemberShippingAddressListDto);
  }
} 