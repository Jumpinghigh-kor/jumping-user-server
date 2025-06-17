import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { MemberReviewAppService } from './member-review-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetMemberReviewAppListDto, UpdateMemberReviewAppDto, DeleteMemberReviewAppDto, ReviewImageDto, GetMemberReviewAppImgDto } from './dto/member-review-app.dto';

@Controller('member-review-app')
@UseGuards(JwtAuthGuard)
export class MemberReviewAppController {
  constructor(private readonly memberReviewAppService: MemberReviewAppService) {}

  @Post('getMemberReviewAppList')
  async getMemberReviewAppList(
    @Body() getMemberReviewAppListDto: GetMemberReviewAppListDto
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.memberReviewAppService.getMemberReviewAppList(getMemberReviewAppListDto);
  }

  @Post('getCompleteMemberReviewAppList')
  async getCompleteMemberReviewAppList(
    @Body('mem_id') mem_id: string
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.memberReviewAppService.getCompleteMemberReviewAppList(mem_id);
  }

  @Post('insertMemberReviewApp')
  async insertMemberReviewApp(
    @Body() reviewData: {
      mem_id: string;
      product_app_id: string;
      title: string;
      content: string;
      star_point: number;
      reg_id: string;
      images?: ReviewImageDto[];
    }
  ): Promise<{ success: boolean; data: any | null; code: string }> {
    return this.memberReviewAppService.insertMemberReviewApp(reviewData);
  }

  @Post('updateMemberReviewApp')
  async updateMemberReviewApp(
    @Body() updateMemberReviewAppDto: UpdateMemberReviewAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberReviewAppService.updateMemberReviewApp(updateMemberReviewAppDto);
  }

  @Post('deleteMemberReviewApp')
  async deleteMemberReviewApp(
    @Body() deleteMemberReviewAppDto: DeleteMemberReviewAppDto
  ): Promise<{ success: boolean; message: string; code: string }> {
    return this.memberReviewAppService.deleteMemberReviewApp(deleteMemberReviewAppDto);
  }

  @Post('getMemberReviewAppImgList')
  async getMemberReviewAppImgList(
    @Body() getMemberReviewAppImgDto: GetMemberReviewAppImgDto
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.memberReviewAppService.getMemberReviewAppImgList(getMemberReviewAppImgDto.review_app_id);
  }
}