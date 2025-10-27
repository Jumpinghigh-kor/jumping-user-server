import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InquiryShoppingApp } from '../entities/inquiry-shopping-app.entity';
import { DeleteInquiryShoppingAppDto, GetInquiryShoppingAppListDto, InquiryShoppingAppListResponse, InsertInquiryShoppingAppDto, UpdateInquiryShoppingAppDto } from './dto/inquiry-shopping-app.dto';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';

@Injectable()
export class InquiryShoppingAppService {
  constructor(
    @InjectRepository(InquiryShoppingApp)
    private inquiryShoppingAppRepository: Repository<InquiryShoppingApp>,
    private dataSource: DataSource,
  ) {}

  async getInquiryShoppingAppList(getInquiryShoppingAppListDto: GetInquiryShoppingAppListDto): Promise<{ success: boolean; data: InquiryShoppingAppListResponse[] | null; code: string }> {
    const { mem_id } = getInquiryShoppingAppListDto;

    try {
      // 요청된 쿼리를 사용하여 데이터 조회
      const inquiryShoppingAppList = await this.dataSource
        .createQueryBuilder()
        .select('title', 'title')
        .addSelect('content', 'content')
        .addSelect('inquiry_type', 'inquiry_type')
        .addSelect('inquiry_shopping_app_id', 'inquiry_shopping_app_id')
        .addSelect('answer', 'answer')
        .addSelect('answer_dt', 'answer_dt')
        .addSelect('reg_dt', 'reg_dt')
        .from('inquiry_shopping_app', 'ia')
        .where('ia.del_yn = :del_yn', { del_yn: 'N' })
        .andWhere('ia.mem_id = :mem_id', { mem_id: mem_id })
        .orderBy('inquiry_shopping_app_id', 'DESC')
        .getRawMany();

      if (!inquiryShoppingAppList || inquiryShoppingAppList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: inquiryShoppingAppList,
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

  async insertInquiryShoppingApp(insertInquiryAppDto: InsertInquiryShoppingAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { 
        mem_id,
        product_app_id,
        content
      } = insertInquiryAppDto;

      await this.inquiryShoppingAppRepository
        .createQueryBuilder()
        .insert()
        .into(InquiryShoppingApp)
        .values({
          mem_id,
          product_app_id,
          content,
          del_yn: 'N',
          reg_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          reg_id: mem_id,
          mod_dt: undefined,
          mod_id: undefined
        })
        .execute();

      return {
        success: true,
        message: '문의사항이 성공적으로 저장되었습니다.',
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

  async updateInquiryShoppingApp(updateInquiryShoppingAppDto: UpdateInquiryShoppingAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { 
        inquiry_shopping_app_id,
        content,
        mem_id,
        mod_id
      } = updateInquiryShoppingAppDto;

      // mem_id가 있으면 mod_id로 사용
      const finalModId = mem_id || mod_id;

      // 필드 값 설정
      const updateFields = {
        mod_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
        mod_id: finalModId
      };

      if (content !== undefined) {
        updateFields['content'] = content;
      }
      
      // Using QueryBuilder
      const result = await this.inquiryShoppingAppRepository
        .createQueryBuilder()
        .update(InquiryShoppingApp)
        .set(updateFields)
        .where("inquiry_shopping_app_id = :inquiry_shopping_app_id", { inquiry_shopping_app_id })
        .execute();

      if (result.affected === 0) {
        return {
          success: false,
          message: '업데이트할 문의사항을 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        message: '문의사항이 성공적으로 업데이트되었습니다.',
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

  async deleteInquiryShoppingApp(deleteInquiryShoppingAppDto: DeleteInquiryShoppingAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { 
        inquiry_shopping_app_id,
        mem_id
      } = deleteInquiryShoppingAppDto;

      // Using QueryBuilder
      const result = await this.inquiryShoppingAppRepository
        .createQueryBuilder()
        .update(InquiryShoppingApp)
        .set({
          del_yn: 'Y',
          mod_dt: () => "DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')",
          mod_id: mem_id
        })
        .where("inquiry_shopping_app_id = :inquiry_shopping_app_id", { inquiry_shopping_app_id })
        .execute();

      if (result.affected === 0) {
        return {
          success: false,
          message: '삭제할 문의사항을 찾을 수 없습니다.',
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        message: '문의사항이 성공적으로 삭제되었습니다.',
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