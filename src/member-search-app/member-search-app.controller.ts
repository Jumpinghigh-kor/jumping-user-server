import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MemberSearchAppService } from './member-search-app.service';
import { SearchProductDto, GetMemberSearchAppListDto, DeleteMemberSearchAppDto, InsertMemberSearchAppDto } from './dto/member-search-app.dto';

@UseGuards(JwtAuthGuard)
@Controller('member-search-app')
export class MemberSearchAppController {
  constructor(private readonly memberSearchAppService: MemberSearchAppService) {}

  @Post('getSearchProduct')
  getSearchProduct(@Body() searchProductDto: SearchProductDto) {
    return this.memberSearchAppService.getSearchProduct(searchProductDto);
  }

  @Post('getMemberSearchAppList')
  getMemberSearchAppList(@Body() getMemberSearchAppListDto: GetMemberSearchAppListDto) {
    return this.memberSearchAppService.getMemberSearchAppList(getMemberSearchAppListDto);
  }

  @Post('deleteMemberSearchApp')
  deleteMemberSearchApp(@Body() deleteMemberSearchAppDto: DeleteMemberSearchAppDto) {
    return this.memberSearchAppService.deleteMemberSearchApp(deleteMemberSearchAppDto);
  }

  @Post('insertMemberSearchApp')
  insertMemberSearchApp(@Body() insertMemberSearchAppDto: InsertMemberSearchAppDto) {
    return this.memberSearchAppService.insertMemberSearchApp(insertMemberSearchAppDto);
  }
} 