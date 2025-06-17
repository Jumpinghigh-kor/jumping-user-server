import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MemberCouponAppService } from './member-coupon-app.service';
import { DeleteMemberCouponAppDto, GetMemberCouponAppListDto, UpdateMemberCouponAppDto, GetCouponAppDto } from './dto/member-coupon-app.dto';
import { MemberCouponAppListResponse } from './dto/member-coupon-app.dto';

@Controller('member-coupon-app')
@UseGuards(JwtAuthGuard)
export class MemberCouponAppController {
  constructor(private readonly memberCouponAppService: MemberCouponAppService) {}

  @Post('getMemberCouponAppList')
  async getMemberCouponAppList(
    @Body() getMemberCouponAppListDto: GetMemberCouponAppListDto
  ): Promise<{ success: boolean; data: MemberCouponAppListResponse[] | null; code: string }> {
    return this.memberCouponAppService.getMemberCouponAppList(getMemberCouponAppListDto);
  }

  @Post('getCouponAppList')
  async getCouponAppList(
    @Body() getCouponAppDto: GetCouponAppDto
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.memberCouponAppService.getCouponAppList(getCouponAppDto.product_app_id);
  }

  @Post('insertMemberCouponApp')
  async insertMemberCouponApp(
    @Body() couponData: any
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberCouponAppService.insertMemberCouponApp(couponData);
  }

} 