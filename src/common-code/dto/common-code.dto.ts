import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InsertCommonFileDto {
  @IsNotEmpty()
  @IsString()
  file_name: string;

  @IsNotEmpty()
  @IsString()
  file_path: string;

  @IsNotEmpty()
  @IsString()
  file_division: string;

  @IsNotEmpty()
  @IsNumber()
  mem_id: number;

  @IsOptional()
  @IsString()
  del_yn: string;

  @IsOptional()
  reg_dt: string;

  @IsOptional()
  @IsNumber()
  reg_id: number;

  @IsOptional()
  mod_dt: string;

  @IsOptional()
  @IsNumber()
  mod_id: number;
}

export class CommonDto {
  @IsNotEmpty()
  @IsString()
  group_code: string;
} 