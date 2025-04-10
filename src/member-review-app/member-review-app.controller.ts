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
}
