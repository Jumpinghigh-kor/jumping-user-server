import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { EventAppService } from './event-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { getEventAppListDto, EventAppListResponse } from './dto/event-app.dto';

@Controller('event-app')
@UseGuards(JwtAuthGuard)
export class EventAppController {
  constructor(private readonly eventAppService: EventAppService) {}

  @Post('getEventAppList')
  async getEventAppList(
    @Body() getEventAppListDto: getEventAppListDto
  ): Promise<{ success: boolean; data: EventAppListResponse | null; code: string }> {
    return this.eventAppService.getEventAppList(getEventAppListDto.event_app_id);
  }

  // 메소드는 나중에 추가 예정
} 