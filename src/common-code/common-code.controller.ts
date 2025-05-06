import { Body, Controller, Post } from '@nestjs/common';
import { CommonCodeService } from './common-code.service';
import { InsertCommonFileDto } from './dto/common-code.dto';

@Controller('common-code')
export class CommonCodeController {
  constructor(private readonly commonCodeService: CommonCodeService) {}

  @Post('insertCommonFile')
  async insertCommonFile(
    @Body() insertCommonFileDto: InsertCommonFileDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.commonCodeService.insertCommonFile(insertCommonFileDto);
  }

  @Post('getCommonCodeList')
  async getCommonCodeList(
    @Body() body: { group_code: string }
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.commonCodeService.getCommonCodeList(body.group_code);
  }
} 