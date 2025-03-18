import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  mem_email_id: string;

  @IsString()
  @MinLength(4)
  mem_app_password: string;
} 