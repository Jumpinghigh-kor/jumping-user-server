import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMemberOrdersDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;
}

export class UpdateMemberOrdersRemainingCntDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  memo_id: number;
}

export interface MemberOrderResponse {
  memo_pro_name: string;
  memo_pro_price: number;
  memo_remaining_counts: number;
  memo_start_date: Date;
  memo_end_date: Date;
  memo_purchase_date: Date;
} 