import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { COMMON_RESPONSE_CODES } from '../core/constants/response-codes';
import { ProductApp } from '../entities/product-app.entity';
import { GetProductAppListDto, ProductAppListResponse, GetProductAppImgDetailDto, ProductAppImgDetailResponse, SelectProductAppThumbnailImgDto, ProductAppThumbnailImgResponse } from './dto/product-app.dto';

@Injectable()
export class ProductAppService {
  constructor(
    @InjectRepository(ProductApp)
    private productAppRepository: Repository<ProductApp>
  ) {}

  async getProductAppList(getProductAppListDto: GetProductAppListDto): Promise<{ success: boolean; data: ProductAppListResponse[] | null; code: string }> {
    try {
      const { big_category, mem_id } = getProductAppListDto;
      const queryBuilder = this.productAppRepository
        .createQueryBuilder('p')
        .select([
          'product_app_id',
          'big_category',
          'small_category',
          'title',
          'FORMAT(price, 0) AS price',
          'FORMAT(original_price, 0) AS original_price',
          'discount',
          'give_point',
          'sell_start_dt',
          'sell_end_dt',
          'view_yn',
          'del_yn',
          'reg_dt',
          'reg_id',
          'mod_dt',
          'mod_id',
        ])
        .where('del_yn = :del_yn', { del_yn: 'N' })
        .andWhere('view_yn = :view_yn', { view_yn: 'Y' })
        .setParameter('mem_id', mem_id);
      
      if (big_category) {
        queryBuilder.andWhere('big_category = :big_category', { big_category });
      }
      
      const productAppList = await queryBuilder.getRawMany();

      if (!productAppList || productAppList.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: productAppList,
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

  async getProductAppImgDetail(getProductAppImgDetailDto: GetProductAppImgDetailDto): Promise<{ success: boolean; data: ProductAppImgDetailResponse[] | null; code: string }> {
    try {
      const { product_app_id } = getProductAppImgDetailDto;
      
      const productAppImgDetail = await this.productAppRepository
        .createQueryBuilder('pa')
        .select([
          'cf.file_name AS file_name',
          'cf.file_division AS file_division',
          'cf.file_path AS file_path',
          'pai.img_form AS img_form',
          'pai.order_seq AS order_seq'
        ])
        .leftJoin('product_app_img', 'pai', 'pa.product_app_id = pai.product_app_id')
        .leftJoin('common_file', 'cf', 'pai.file_id = cf.file_id')
        .where('pa.product_app_id = :product_app_id', { product_app_id })
        .andWhere('pa.del_yn = :del_yn', { del_yn: 'N' })
        .andWhere('pai.use_yn = :use_yn', { use_yn: 'Y' })
        .andWhere('pai.del_yn = :pai_del_yn', { pai_del_yn: 'N' })
        .orderBy('pai.product_app_img_id', 'DESC')
        .getRawMany();

      if (!productAppImgDetail || productAppImgDetail.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: productAppImgDetail,
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

  async selectProductAppThumbnailImg(selectProductAppThumbnailImgDto: SelectProductAppThumbnailImgDto): Promise<{ success: boolean; data: ProductAppThumbnailImgResponse[] | null; code: string }> {
    try {
      
      const queryBuilder = this.productAppRepository
        .createQueryBuilder('pa')
        .select([
          'cf.file_name AS file_name',
          'cf.file_division AS file_division',
          'cf.file_path AS file_path',
          'pa.product_app_id AS product_app_id',
          'pai.img_form AS img_form',
          'pai.order_seq AS order_seq'
        ])
        .leftJoin('product_app_img', 'pai', 'pa.product_app_id = pai.product_app_id')
        .leftJoin('common_file', 'cf', 'pai.file_id = cf.file_id')
        .where('pa.del_yn = :del_yn', { del_yn: 'N' })
        .andWhere('pai.use_yn = :use_yn', { use_yn: 'Y' })
        .andWhere('pai.del_yn = :pai_del_yn', { pai_del_yn: 'N' })
        .andWhere('pai.order_seq = :order_seq', { order_seq: 1 })
        .andWhere('pai.img_form = :img_form', { img_form: 'REPRESENTER' });
      
      const thumbnailImg = await queryBuilder.getRawMany();

      if (!thumbnailImg || thumbnailImg.length === 0) {
        return {
          success: true,
          data: null,
          code: COMMON_RESPONSE_CODES.NO_DATA
        };
      }

      return {
        success: true,
        data: thumbnailImg,
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