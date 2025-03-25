import { Body, Controller, Post } from '@nestjs/common';
import { CommonService } from './common.service';
import { InsertCommonFileDto } from './dto/common.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('insertCommonFile')
  async insertCommonFile(
    @Body() insertCommonFileDto: InsertCommonFileDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.commonService.insertCommonFile(insertCommonFileDto);
  }
} 