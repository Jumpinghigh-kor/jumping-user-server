import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MemberShippingAddressService } from './member-shipping-address.service';
import { GetMemberShippingAddressListDto, InsertMemberShippingAddressDto, UpdateMemberShippingAddressDto, DeleteMemberShippingAddressDto, UpdateDeliveryRequestDto } from './dto/member-shipping-address.dto';

@UseGuards(JwtAuthGuard)
@Controller('member-shipping-address')
export class MemberShippingAddressController {
  constructor(private readonly memberShippingAddressService: MemberShippingAddressService) {}

  @Post('getMemberShippingAddressList')
  async getMemberShippingAddressList(
    @Body() getMemberShippingAddressListDto: GetMemberShippingAddressListDto
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.memberShippingAddressService.getMemberShippingAddressList(getMemberShippingAddressListDto);
  }

  @Post('getTargetMemberShippingAddress')
  async getTargetMemberShippingAddress(
    @Body() getMemberShippingAddressListDto: GetMemberShippingAddressListDto
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.memberShippingAddressService.getTargetMemberShippingAddress(getMemberShippingAddressListDto);
  }

  @Post('insertMemberShippingAddress')
  async insertMemberShippingAddress(
    @Body() insertMemberShippingAddressDto: InsertMemberShippingAddressDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberShippingAddressService.insertMemberShippingAddress(insertMemberShippingAddressDto);
  }

  @Post('updateMemberShippingAddress')
  async updateMemberShippingAddress(
    @Body() updateMemberShippingAddressDto: UpdateMemberShippingAddressDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberShippingAddressService.updateMemberShippingAddress(updateMemberShippingAddressDto);
  }

  @Post('deleteMemberShippingAddress')
  async deleteMemberShippingAddress(
    @Body() deleteMemberShippingAddressDto: DeleteMemberShippingAddressDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberShippingAddressService.deleteMemberShippingAddress(deleteMemberShippingAddressDto);
  }

  @Post('updateDeliveryRequest')
  async updateDeliveryRequest(
    @Body() updateDeliveryRequestDto: UpdateDeliveryRequestDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberShippingAddressService.updateDeliveryRequest(updateDeliveryRequestDto);
  }
} 