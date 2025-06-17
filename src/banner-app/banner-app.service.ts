import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerApp } from '../entities/banner-app.entity';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { BannerAppInfo, BannerAppResponse, SelectBannerDto } from './dto/banner-app.dto';

@Injectable()
export class BannerAppService {
  constructor(
    @InjectRepository(BannerApp)
    private bannerAppRepository: Repository<BannerApp>,
  ) {}

  async selectBannerAppInfo(params: any): Promise<BannerAppResponse> {
    try {      
      // 파라미터에서 banner_locate 추출
      const bannerLocate = params.banner_locate || params.bannerLocate;
      
      const result = await this.bannerAppRepository
        .createQueryBuilder('ba')
        .leftJoinAndSelect('common_file', 'cf', 'ba.file_id = cf.file_id')
        .select([
          'cf.file_id',
          'cf.file_name',
          'cf.file_path',
          'cf.file_division',
          'ba.banner_app_id',
          'ba.banner_type',
          'ba.banner_locate',
          'ba.title',
          'ba.content',
          'ba.reg_dt',
          'ba.reg_id'
        ])
        .where('ba.del_yn = :delYn', { delYn: 'N' })
        .andWhere('ba.use_yn = :useYn', { useYn: 'Y' })
        .andWhere('ba.banner_locate = :bannerLocate', { bannerLocate })
        .getRawMany();
        
      if (!result || result.length === 0) {
        return {
          success: true,
          message: '배너 정보가 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA,
          data: []
        };
      }
      
      return {
        success: true,
        message: '배너 정보를 성공적으로 조회했습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS,
        data: result
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
          code: COMMON_RESPONSE_CODES.FAIL
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 