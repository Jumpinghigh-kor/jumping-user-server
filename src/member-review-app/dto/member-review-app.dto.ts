import { IsNumber, IsOptional, IsString, IsIn, IsArray, ValidateNested, Min, Max, ArrayMaxSize } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetMemberReviewAppListDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  product_app_id?: number;

  @IsOptional()
  @IsString()
  filter?: string;

  @IsOptional()
  @IsString()
  review_img_yn?: string;
}

export class ReviewImageDto {
  @IsString()
  file_name: string;
}

export class InsertMemberReviewAppDto {
  @IsString()
  mem_id: string;

  @IsString()
  product_app_id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value) : value)
  star_point: number;

  @IsString()
  reg_id: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(3)
  @Type(() => ReviewImageDto)
  images?: ReviewImageDto[];
}

export class UpdateMemberReviewAppDto {
  @IsNumber()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value) : value)
  review_app_id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value) : value)
  star_point: number;

  @IsNumber()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value) : value)
  mem_id: number;
}

export class DeleteMemberReviewAppDto {
  @IsNumber()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value) : value)
  review_app_id: number;

  @IsNumber()
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value) : value)
  mem_id: number;
}

export class GetMemberReviewAppImgDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  review_app_id?: number;
}