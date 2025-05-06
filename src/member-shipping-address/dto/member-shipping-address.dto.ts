import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetMemberShippingAddressListDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mem_id: number;
}

export interface MemberShippingAddressResponse {
  // 응답 데이터 인터페이스 정의 예정
} 