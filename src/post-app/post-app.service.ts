import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { PostApp } from '../entities/post-app.entity';
import { GetPostAppListDto, PostAppListResponse, InsertMemberPostAppDto, DeleteMemberPostAppDto, UpdateMemberPostAppDto } from './dto/post-app.dto';
import { getCurrentDateYYYYMMDDHHIISS } from 'src/core/utils/date.utils';

@Injectable()
export class PostAppService {
  constructor(
    @InjectRepository(PostApp)
    private postAppRepository: Repository<PostApp>
  ) {}

  async getPostAppList(getPostAppListDto: GetPostAppListDto): Promise<{ success: boolean; data: PostAppListResponse[] | null; code: string }> {
    try {
      const { mem_id, post_type } = getPostAppListDto;

      const queryBuilder = this.postAppRepository
        .createQueryBuilder('pa')
        .select([
          'pa.post_app_id AS post_app_id'
          , 'pa.post_type AS post_type'
          , 'pa.all_send_yn AS all_send_yn'
          , 'pa.push_send_yn AS push_send_yn'
          , 'pa.title AS title'
          , 'pa.content AS content'
          , 'DATE_FORMAT(pa.reg_dt, "%Y.%m.%d %H:%i") AS reg_dt'
          , 'mpa.member_post_app_id AS member_post_app_id'
          , 'mpa.read_yn AS read_yn'
          , 'mpa.read_dt AS read_dt'
        ])
        .leftJoin('member_post_app', 'mpa', 'pa.post_app_id = mpa.post_app_id')
        .leftJoin('members', 'm', 'mpa.mem_id = m.mem_id')
        .where('pa.del_yn = :paDel', { paDel: 'N' })
        .andWhere(new Brackets(qb => {
          qb.where('mpa.reg_dt IS NULL')
            .orWhere('m.app_active_dt < mpa.reg_dt');
        }))
        .andWhere(new Brackets(qb => {
          qb.where('pa.all_send_yn = :allY', { allY: 'Y' })
            .andWhere('mpa.del_yn = :mpaDel', { mpaDel: 'N' })
            .orWhere('mpa.del_yn IS NULL')
            .orWhere(new Brackets(qb2 => {
              qb2.where('pa.all_send_yn = :allN', { allN: 'N' })
                 .andWhere('mpa.mem_id = :mem_id', { mem_id })
                 .andWhere('mpa.del_yn = :mpaDel', { mpaDel: 'N' });
            }));
        }))
        .andWhere(new Brackets(qb => {
          qb.where("pa.post_type = 'ALL'")
            .orWhere('pa.post_type = :post_type', { post_type });
        }))
        .orderBy('pa.post_app_id', 'DESC');

      const postAppList = await queryBuilder.getRawMany();

      return {
        success: true,
        data: postAppList,
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

  async insertMemberPostApp(insertMemberPostAppDto: InsertMemberPostAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, post_app_id } = insertMemberPostAppDto;
      
      const reg_dt = getCurrentDateYYYYMMDDHHIISS();
      
      await this.postAppRepository
        .createQueryBuilder()
        .insert()
        .into('member_post_app')
        .values({
          mem_id: mem_id,
          post_app_id: post_app_id,
          read_yn: 'Y',
          read_dt: reg_dt,
          del_yn: 'N',
          reg_dt: reg_dt,
          reg_id: mem_id,
          mod_dt: null,
          mod_id: null
        })
        .execute();
      
      return {
        success: true,
        message: '회원 우편 정보가 성공적으로 등록되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error creating member post:', error);
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

  async updateMemberPostApp(updateMemberPostAppDto: UpdateMemberPostAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, member_post_app_id, read_yn } = updateMemberPostAppDto;
      
      const reg_dt = getCurrentDateYYYYMMDDHHIISS();
      
      await this.postAppRepository
        .createQueryBuilder()
        .update('member_post_app')
        .set({
          read_yn: read_yn,
          read_dt: reg_dt,
          mod_dt: reg_dt,
          mod_id: mem_id
        })
        .where('member_post_app_id = :member_post_app_id', { member_post_app_id })
        .execute();
      
      return {
        success: true,
        message: '회원 우편 정보가 성공적으로 업데이트되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error updating member post:', error);
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

  async deleteMemberPostApp(deleteMemberPostAppDto: DeleteMemberPostAppDto): Promise<{ success: boolean; message: string; code: string }> {
    try {
      const { mem_id, post_app_id } = deleteMemberPostAppDto;
      
      const reg_dt = getCurrentDateYYYYMMDDHHIISS();
      
      await this.postAppRepository
        .createQueryBuilder()
        .update('member_post_app')
        .set({
          del_yn: 'Y',
          mod_dt: reg_dt,
          mod_id: mem_id
        })
        .where('post_app_id IN (:...post_app_ids)', { post_app_ids: post_app_id })
        .andWhere('mem_id = :mem_id', { mem_id: mem_id })
        .execute();
      
      return {
        success: true,
        message: '회원 우편 정보가 성공적으로 삭제되었습니다.',
        code: COMMON_RESPONSE_CODES.SUCCESS
      };
    } catch (error) {
      console.error('Error deleting member post:', error);
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