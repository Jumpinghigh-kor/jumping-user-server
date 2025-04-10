import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BannerAppService } from './banner-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BannerAppResponse } from './dto/banner-app.dto';

@Controller('banner-app')
@UseGuards(JwtAuthGuard)
export class BannerAppController {
  constructor(private readonly bannerAppService: BannerAppService) {}

  @Post('selectBannerAppInfo')
  async selectBannerAppInfo(
    @Body() params: any
  ): Promise<BannerAppResponse> {
    return await this.bannerAppService.selectBannerAppInfo(params);
  }
}