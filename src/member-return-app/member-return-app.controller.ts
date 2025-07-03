import { Controller, Post, Body } from '@nestjs/common';
import { MemberReturnAppService } from './member-return-app.service';
import { DeleteMemberReturnAppDto, GetMemberReturnAppDto, InsertMemberReturnAppDto } from './dto/member-return-app.dto';

@Controller('member-return-app')
export class MemberReturnAppController {
  constructor(
    private readonly memberReturnAppService: MemberReturnAppService,
  ) {}

  @Post('/getMemberReturnAppList')
  getMemberReturnAppList(@Body() getMemberReturnAppDto: GetMemberReturnAppDto) {
    return this.memberReturnAppService.getMemberReturnAppList(getMemberReturnAppDto.mem_id);
  }

  @Post('/insertMemberReturnApp')
  async insertMemberReturnApp(
    @Body() insertMemberReturnAppDto: InsertMemberReturnAppDto
  ): Promise<{ success: boolean; data: any | null; code: string }> {
    return this.memberReturnAppService.insertMemberReturnApp(insertMemberReturnAppDto);
  }

  @Post('/deleteMemberReturnApp')
  async deleteMemberReturnApp(
    @Body() deleteMemberReturnAppDto: DeleteMemberReturnAppDto
  ): Promise<{ success: boolean; data: any | null; code: string }> {
    return this.memberReturnAppService.deleteMemberReturnApp(deleteMemberReturnAppDto);
  }
} 