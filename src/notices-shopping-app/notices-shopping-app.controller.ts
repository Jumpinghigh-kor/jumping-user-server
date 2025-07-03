import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { NoticesShoppingAppService } from './notices-shopping-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetNoticesShoppingAppListDto, NoticesShoppingAppListResponse } from './dto/notices-shopping-app.dto';

@Controller('notices-shopping-app')
@UseGuards(JwtAuthGuard)
export class NoticesShoppingAppController {
  constructor(private readonly noticesShoppingAppService: NoticesShoppingAppService) {}
  
  @Post('getNoticesShoppingAppList')
  async getNoticesShoppingAppList(
    @Body() getNoticesShoppingAppListDto: GetNoticesShoppingAppListDto
  ): Promise<{ success: boolean; data: NoticesShoppingAppListResponse[] | null; code: string }> {
    return this.noticesShoppingAppService.getNoticesShoppingAppList(getNoticesShoppingAppListDto);
  }
} 