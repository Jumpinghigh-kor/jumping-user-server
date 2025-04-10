import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { MemberReviewApp } from '../entities/member-review-app.entity';
import { GetMemberReviewAppListDto } from './dto/member-review-app.dto';

@Injectable()
export class MemberReviewAppService {
  constructor(
    @InjectRepository(MemberReviewApp)
    private memberReviewAppRepository: Repository<MemberReviewApp>
  ) {}

  async getMemberReviewAppList(getMemberReviewAppListDto: GetMemberReviewAppListDto): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      const { product_app_id } = getMemberReviewAppListDto;
      
      const queryBuilder = this.memberReviewAppRepository
        .createQueryBuilder('mra')
        .select([
          'm.mem_nickname AS mem_nickname',
          'mra.review_app_id AS review_app_id',
          'mra.mem_id AS mem_id',
          'mra.product_app_id AS product_app_id',
          'mra.content AS content',
          'mra.star_point AS star_point',
          'DATE_FORMAT(mra.reg_dt, "%Y.%m.%d") AS reg_dt'
        ])
        .innerJoin('members', 'm', 'm.mem_id = mra.mem_id')
        .where('mra.del_yn = :del_yn', { del_yn: 'N' });
      
      // Conditionally add product_app_id filter
      if (product_app_id) {
        queryBuilder.andWhere('mra.product_app_id = :product_app_id', { product_app_id });
      }
      
      const memberReviewAppList = await queryBuilder.getRawMany();

      if (!memberReviewAppList || memberReviewAppList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: memberReviewAppList,
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
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