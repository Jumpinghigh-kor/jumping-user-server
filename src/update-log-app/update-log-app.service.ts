import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { UpdateLogAppInfo } from './dto/update-log-app.dto';

@Injectable()
export class UpdateLogAppService {
  constructor(
    private dataSource: DataSource
  ) {}

  async getUpdateLogAppInfo(): Promise<{ success: boolean; data: UpdateLogAppInfo[] | null; code: string }> {
    try {
      const updateLogAppInfo = await this.dataSource
        .createQueryBuilder()
        .select('up_app_id', 'up_app_id')
        .addSelect('up_app_version', 'up_app_version')
        .addSelect('up_app_desc', 'up_app_desc')
        .addSelect('reg_dt', 'reg_dt')
        .from('update_log_app', 'ula')
        .orderBy('up_app_id', 'DESC')
        .limit(1)
        .getRawOne();

      return {
        success: true,
        data: updateLogAppInfo,
        code: COMMON_RESPONSE_CODES.SUCCESS,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        code: COMMON_RESPONSE_CODES.FAIL,
      };
    }
  }
} 