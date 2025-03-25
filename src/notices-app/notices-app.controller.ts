import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NoticesAppService } from './notices-app.service';
import { GetNoticesAppListDto, NoticesAppListResponse } from './dto/notices-app.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notices-app')
@UseGuards(JwtAuthGuard)
export class NoticesAppController {
  constructor(private readonly noticesAppService: NoticesAppService) {}

  @Post('getNoticesAppList')
  async getNoticesAppList(
    @Body() getNoticesAppListDto: GetNoticesAppListDto
  ): Promise<{ success: boolean; data: NoticesAppListResponse[] | null; code: string }> {
    return this.noticesAppService.getNoticesAppList(getNoticesAppListDto);
  }
} 