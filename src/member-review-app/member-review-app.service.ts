import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { MemberReviewApp } from '../entities/member-review-app.entity';
import { GetMemberReviewAppListDto } from './dto/member-review-app.dto';
import { getCurrentDateYYYYMMDDHHIISS } from '../core/utils/date.utils';

@Injectable()
export class MemberReviewAppService {
  constructor(
    @InjectRepository(MemberReviewApp)
    private memberReviewAppRepository: Repository<MemberReviewApp>,
    private connection: Connection
  ) {}

  async getMemberReviewAppList(getMemberReviewAppListDto: GetMemberReviewAppListDto): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      const { product_app_id } = getMemberReviewAppListDto;
      
      const queryBuilder = this.memberReviewAppRepository
        .createQueryBuilder('mra')
        .select([
          'm.mem_nickname AS mem_nickname'
          , 'mra.review_app_id AS review_app_id'
          , 'mra.mem_id AS mem_id'
          , 'mra.product_app_id AS product_app_id'
          , 'mra.title AS title'
          , 'mra.content AS content'
          , 'mra.star_point AS star_point'
          , 'DATE_FORMAT(mra.reg_dt, "%Y.%m.%d") AS reg_dt'
        ])
        .innerJoin('members', 'm', 'mra.mem_id = m.mem_id')
        .where('mra.del_yn = :del_yn', { del_yn: 'N' });
      
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

  async getTargetMemberReviewAppList(mem_id: string): Promise<{ success: boolean; data: any[] | null; code: string }> {
    try {
      const queryBuilder = this.memberReviewAppRepository
        .createQueryBuilder('mra')
        .select([
          'mra.review_app_id AS review_app_id'
          , 'mra.product_app_id AS product_app_id'
          , 'mra.content AS content'
          , 'mra.title AS review_title'
          , 'mra.star_point AS star_point'
          , 'CONCAT(SUBSTRING(DATE_FORMAT(STR_TO_DATE(mra.reg_dt, "%Y%m%d%H%i%s"), "%Y.%m.%d"), 3, 2), ".", DATE_FORMAT(STR_TO_DATE(mra.reg_dt, "%Y%m%d%H%i%s"), "%m.%d")) AS reg_dt'
          , 'pa.title AS product_title'
          , 'pa.brand_name AS brand_name'
          , 'pa.product_name AS product_name'
        ])
        .leftJoin('members', 'm', 'mra.mem_id = m.mem_id')
        .leftJoin('product_app', 'pa', 'mra.product_app_id = pa.product_app_id')
        .where('mra.mem_id = :mem_id', { mem_id });
      
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

  async insertMemberReviewApp(reviewData: {
    mem_id: string;
    product_app_id: string;
    title: string;
    content: string;
    star_point: number;
    images?: Array<{
      file_name: string;
      file_data: any;
    }>;
  }): Promise<{ success: boolean; data: any | null; code: string }> {

    console.log('reviewData:::', reviewData);
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const formattedDate = getCurrentDateYYYYMMDDHHIISS();

      // Insert into member_review_app using query builder
      const reviewInsertResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('member_review_app')
        .values({
          mem_id: reviewData.mem_id,
          product_app_id: reviewData.product_app_id,
          title: reviewData.title,
          content: reviewData.content,
          star_point: reviewData.star_point,
          del_yn: 'N',
          reg_dt: formattedDate,
          reg_id: reviewData.mem_id,
          mod_dt: formattedDate,
          mod_id: reviewData.mem_id
        })
        .execute();

      // Get the inserted review ID
      const reviewAppId = reviewInsertResult.identifiers[0].review_app_id || reviewInsertResult.raw.insertId;

      // Check if there are images to process
      if (reviewData.images && reviewData.images.length > 0) {
        // Limit to max 3 images
        const imagesToProcess = reviewData.images.slice(0, 3);

        for (let i = 0; i < imagesToProcess.length; i++) {
          const image = imagesToProcess[i];
          
          // Insert into common_file using query builder
          const fileInsertResult = await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('common_file')
            .values({
              file_name: image.file_name,
              file_path: '/review',
              file_division: 'review',
              del_yn: 'N',
              reg_dt: formattedDate,
              reg_id: reviewData.mem_id,
              mod_dt: formattedDate,
              mod_id: reviewData.mem_id
            })
            .execute();

          const fileId = fileInsertResult.identifiers[0].file_id || fileInsertResult.raw.insertId;
          const orderSeq = i + 1; // 1, 2, 3

          // Insert into member_review_app_img using query builder
          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('member_review_app_img')
            .values({
              review_app_id: reviewAppId,
              file_id: fileId,
              order_seq: orderSeq,
              del_yn: 'N',
              reg_dt: formattedDate,
              reg_id: reviewData.mem_id,
              mod_dt: formattedDate,
              mod_id: reviewData.mem_id
            })
            .execute();
        }
      }

      await queryRunner.commitTransaction();

      return {
        success: true,
        data: { review_app_id: reviewAppId },
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        {
          success: false,
          message: error.message,
          code: COMMON_RESPONSE_CODES.FAIL
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }
} 