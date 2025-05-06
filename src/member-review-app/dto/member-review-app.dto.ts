import { IsNumber, IsOptional, IsString, IsIn, IsArray, ValidateNested, Min, Max, ArrayMaxSize } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetMemberReviewAppListDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  product_app_id?: number;

}

export class ReviewImageDto {
  @IsString()
  file_name: string;

  @IsOptional()
  file_data: any;
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
  reg_id: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(3)
  @Type(() => ReviewImageDto)
  images?: ReviewImageDto[];
}