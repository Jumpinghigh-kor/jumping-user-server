import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { InsertCommonFileDto } from './dto/common.dto';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { getCurrentDateYYYYMMDDHHIISS } from '../core/utils/date.utils';

@Injectable()
export class CommonService {
  constructor(
    @InjectDataSource() private dataSource: DataSource
  ) {}

  async insertCommonFile(insertCommonFileDto: InsertCommonFileDto): Promise<{ success: boolean; message: string; code: string; file_id?: number }> {
    try {
      const {
        file_name,
        file_path,
        file_division,
        mem_id
      } = insertCommonFileDto;

      const reg_dt = getCurrentDateYYYYMMDDHHIISS();

      const result = await this.dataSource
        .createQueryBuilder()
        .insert()
        .into('common_file')
        .values({
          file_name,
          file_path,
          file_division,
          del_yn: 'N',
          reg_dt,
          reg_id: mem_id,
          mod_dt: null,
          mod_id: null
        })
        .execute();
        
      return {
        success: true,
        message: '파일 정보가 성공적으로 저장되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS,
        file_id: result.raw.insertId
      };
    } catch (error: any) {
      console.log(error.response.data);
      return {
        success: false,
        message: '파일 정보 저장 중 오류가 발생했습니다.',
        code: COMMON_RESPONSE_CODES.FAIL
      };
    }
  }
} 