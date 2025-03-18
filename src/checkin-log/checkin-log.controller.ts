import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { CheckinLogService } from './checkin-log.service';
import { InsertCheckinLogDto, GetCheckinLogListDto, CheckinLogResponse, ValidateMemberNumberDto } from './dto/checkin-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('checkinLog')
@UseGuards(JwtAuthGuard)
export class CheckinLogController {
  constructor(private readonly checkinLogService: CheckinLogService) {}

  @Post('validateMemberNumber')
  async validateMemberNumber(
    @Body() validateMemberNumberDto: ValidateMemberNumberDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.checkinLogService.validateMemberNumber(validateMemberNumberDto);
  }

  @Post('insertCheckinLog')
  async insertCheckinLog(
    @Body() InsertCheckinLogDto: InsertCheckinLogDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.checkinLogService.insertCheckinLog(InsertCheckinLogDto);
  }

  @Post('getCheckinLogList')
  async getCheckinLogList(
    @Body() getCheckinLogListDto: GetCheckinLogListDto
  ): Promise<{ success: boolean; data: CheckinLogResponse[]; code: string }> {
    try {
      if (!getCheckinLogListDto.mem_id || !getCheckinLogListDto.year || !getCheckinLogListDto.month) {
        throw new BadRequestException('Missing required fields');
      }
      return this.checkinLogService.getCheckinLogList(getCheckinLogListDto);
    } catch (error) {
      throw error;
    }
  }
} 