import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetReturnExchangePolicyDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  product_app_id: number;
}