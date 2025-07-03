import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDate } from 'class-validator';

export class InquiryShoppingAppDto {
  @IsNumber()
  @IsNotEmpty()
  inquiry_shopping_app_id: number;

  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsString()
  @IsNotEmpty()
  product_app_id: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  del_yn: string;

  @IsString()
  @IsOptional()
  reg_dt: string;

  @IsNumber()
  @IsOptional()
  reg_id: number;

  @IsString()
  @IsOptional()
  mod_dt: string;

  @IsNumber()
  @IsOptional()
  mod_id: number;
}

export class InsertInquiryShoppingAppDto {
  @IsNumber()
  @IsNotEmpty()
  mem_id: number;

  @IsNumber()
  @IsNotEmpty()
  product_app_id: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

// Additional DTOs can be added here as needed 