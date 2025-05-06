import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { MemberReviewAppService } from './member-review-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetMemberReviewAppListDto  } from './dto/member-review-app.dto';

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

  @Post('getTargetMemberReviewAppList')
  async getTargetMemberReviewAppList(
    @Body('mem_id') mem_id: string
  ): Promise<{ success: boolean; data: any[] | null; code: string }> {
    return this.memberReviewAppService.getTargetMemberReviewAppList(mem_id);
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
      images?: Array<{
        file_name: string;
        file_data: any;
      }>;
    }
  ): Promise<{ success: boolean; data: any | null; code: string }> {
    return this.memberReviewAppService.insertMemberReviewApp(reviewData);
  }
}
