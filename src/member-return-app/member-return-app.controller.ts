import { Controller, Post, Body } from '@nestjs/common';
import { MemberReturnAppService } from './member-return-app.service';
import { CancelMemberReturnAppDto, GetMemberReturnAppDto, InsertMemberReturnAppDto, UpdateMemberReturnAppDto } from './dto/member-return-app.dto';

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
    @Body() insertMemberReturnAppDto: InsertMemberReturnAppDto | InsertMemberReturnAppDto[]
  ): Promise<{ success: boolean; data: any | null; code: string }> {
    return this.memberReturnAppService.insertMemberReturnApp(insertMemberReturnAppDto as InsertMemberReturnAppDto[]);
  }

  @Post('/updateMemberReturnApp')
  async updateMemberReturnApp(
    @Body() updateMemberReturnAppDto: UpdateMemberReturnAppDto
  ): Promise<{ success: boolean; data: any | null; code: string }> {
    return this.memberReturnAppService.updateMemberReturnApp({
      mem_id: updateMemberReturnAppDto.mem_id,
      order_detail_app_ids: updateMemberReturnAppDto.order_detail_app_ids,
      return_reason_type: updateMemberReturnAppDto.return_reason_type,
      reason: updateMemberReturnAppDto.reason,
      cancel_yn: updateMemberReturnAppDto.cancel_yn
    });
  }

  @Post('/cancelMemberReturnApp')
  async cancelMemberReturnApp(
    @Body() cancelMemberReturnAppDto: CancelMemberReturnAppDto
  ): Promise<{ success: boolean; data: any | null; code: string }> {
    return this.memberReturnAppService.cancelMemberReturnApp(cancelMemberReturnAppDto);
  }
} 