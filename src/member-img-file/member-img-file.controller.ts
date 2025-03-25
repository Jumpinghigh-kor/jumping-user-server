import { Body, Controller, Post } from '@nestjs/common';
import { MemberImgFileService } from './member-img-file.service';
import { InsertMemberImgFileDto, MemberImgFileCntDto, SelectMemberImgFileDto, UpdateMemberImgFileDto } from './dto/member-img-file.dto';

@Controller('member-img-file')
export class MemberImgFileController {
  constructor(private readonly memberImgFileService: MemberImgFileService) {}

  @Post('selectMemberImgFile')
  async selectMemberImgFile(
    @Body() selectMemberImgFileDto: SelectMemberImgFileDto
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.memberImgFileService.selectMemberImgFile(selectMemberImgFileDto);
  }

  @Post('selectMemberImgFileCnt')
  async memberImgFileCnt(
    @Body() memberImgFileCntDto: MemberImgFileCntDto
  ): Promise<{ success: boolean; data: { imgCnt: number } | null; code: string }> {
    return this.memberImgFileService.memberImgFileCnt(memberImgFileCntDto);
  }

  @Post('insertMemberImgFile')
  async insertMemberImgFile(
    @Body() insertMemberImgFileDto: InsertMemberImgFileDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberImgFileService.insertMemberImgFile(insertMemberImgFileDto);
  }

  @Post('updateMemberImgFile')
  async updateMemberImgFile(
    @Body() updateMemberImgFileDto: UpdateMemberImgFileDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberImgFileService.updateMemberImgFile(updateMemberImgFileDto);
  }

  @Post('deleteMemberImgFile')
  async deleteMemberImgFile(
    @Body() updateMemberImgFileDto: UpdateMemberImgFileDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberImgFileService.deleteMemberImgFile(updateMemberImgFileDto);
  }
} 