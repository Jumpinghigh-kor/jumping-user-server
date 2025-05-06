import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MemberZzimAppService } from './member-zzim-app.service';
import { InsertMemberZzimAppDto, UpdateMemberZzimAppDto, GetMemberZzimAppListDto, GetMemberZzimAppDetailDto } from './dto/member-zzim-app.dto';

@UseGuards(JwtAuthGuard)
@Controller('member-zzim-app')
export class MemberZzimAppController {
  constructor(private readonly memberZzimAppService: MemberZzimAppService) {}

  @Post('insertMemberZzimApp')
  insertMemberZzimApp(@Body() insertMemberZzimAppDto: InsertMemberZzimAppDto) {
    return this.memberZzimAppService.insertMemberZzimApp(insertMemberZzimAppDto);
  }

  @Post('updateMemberZzimApp')
  updateMemberZzimApp(@Body() updateMemberZzimAppDto: UpdateMemberZzimAppDto) {
    return this.memberZzimAppService.updateMemberZzimApp(updateMemberZzimAppDto);
  }

  @Post('getMemberZzimAppList')
  getMemberZzimAppList(@Body() getMemberZzimAppListDto: GetMemberZzimAppListDto) {
    return this.memberZzimAppService.getMemberZzimAppList(getMemberZzimAppListDto);
  }

  @Post('getMemberZzimAppDetail')
  getMemberZzimAppDetail(@Body() getMemberZzimAppDetailDto: GetMemberZzimAppDetailDto) {
    return this.memberZzimAppService.getMemberZzimAppDetail(getMemberZzimAppDetailDto);
  }
} 