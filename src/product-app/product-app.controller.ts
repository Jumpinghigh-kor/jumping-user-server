import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { ProductAppService } from './product-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetProductAppListDto, ProductAppListResponse, GetProductAppImgDetailDto, ProductAppImgDetailResponse, SelectProductAppThumbnailImgDto, ProductAppThumbnailImgResponse } from './dto/product-app.dto';

@Controller('product-app')
@UseGuards(JwtAuthGuard)
export class ProductAppController {
  constructor(private readonly productAppService: ProductAppService) {}

  @Post('getProductAppList')
  async getProductAppList(
    @Body() getProductAppListDto: GetProductAppListDto
  ): Promise<{ success: boolean; data: ProductAppListResponse[] | null; code: string }> {
    return this.productAppService.getProductAppList(getProductAppListDto);
  } 

  @Post('getProductAppImgDetail')
  async getProductAppImgDetail(
    @Body() getProductAppImgDetailDto: GetProductAppImgDetailDto
  ): Promise<{ success: boolean; data: ProductAppImgDetailResponse[] | null; code: string }> {
    return this.productAppService.getProductAppImgDetail(getProductAppImgDetailDto);
  }

  @Post('getProductAppThumbnailImg')
  async selectProductAppThumbnailImg(
    @Body() selectProductAppThumbnailImgDto: SelectProductAppThumbnailImgDto
  ): Promise<{ success: boolean; data: ProductAppThumbnailImgResponse[] | null; code: string }> {
    return this.productAppService.selectProductAppThumbnailImg(selectProductAppThumbnailImgDto);
  }
} 