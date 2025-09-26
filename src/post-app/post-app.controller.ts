import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { PostAppService } from './post-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetPostAppListDto, PostAppListResponse, InsertMemberPostAppDto, DeleteMemberPostAppDto, UpdateMemberPostAppDto } from './dto/post-app.dto';

@Controller('post-app')
@UseGuards(JwtAuthGuard)
export class PostAppController {
  constructor(private readonly postAppService: PostAppService) {}

  @Post('getPostAppList')
  async getPostAppList(
    @Body() getPostAppListDto: GetPostAppListDto
  ): Promise<{ success: boolean; data: PostAppListResponse[] | null; code: string }> {
    return this.postAppService.getPostAppList(getPostAppListDto);
  } 

  @Post('insertMemberPostApp')
  async insertMemberPostApp(
    @Body() insertMemberPostAppDto: InsertMemberPostAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.postAppService.insertMemberPostApp(insertMemberPostAppDto);
  }

  @Post('updateMemberPostApp')
  async updateMemberPostApp(
    @Body() updateMemberPostAppDto: UpdateMemberPostAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.postAppService.updateMemberPostApp(updateMemberPostAppDto);
  }

  @Post('deleteMemberPostApp')
  async deleteMemberPostApp(
    @Body() deleteMemberPostAppDto: DeleteMemberPostAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.postAppService.deleteMemberPostApp(deleteMemberPostAppDto);
  }
} 