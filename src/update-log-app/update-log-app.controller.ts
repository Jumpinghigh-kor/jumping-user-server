import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UpdateLogAppService } from './update-log-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateLogAppInfo } from './dto/update-log-app.dto';

@Controller('update-log-app')
@UseGuards(JwtAuthGuard)
export class UpdateLogAppController {
  constructor(private readonly updateLogAppService: UpdateLogAppService) {}

  @Post('getUpdateLogAppInfo')
  async getUpdateLogAppInfo(): Promise<{ success: boolean; data: UpdateLogAppInfo[] | null; code: string }> {
    return this.updateLogAppService.getUpdateLogAppInfo();
  }
} 