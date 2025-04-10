import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMemberReviewAppListDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  product_app_id?: number;
}