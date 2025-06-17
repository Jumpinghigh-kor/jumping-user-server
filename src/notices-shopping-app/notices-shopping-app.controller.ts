import { Controller, UseGuards } from '@nestjs/common';
import { NoticesShoppingAppService } from './notices-shopping-app.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notices-shopping-app')
@UseGuards(JwtAuthGuard)
export class NoticesShoppingAppController {
  constructor(private readonly noticesShoppingAppService: NoticesShoppingAppService) {}

  // 메소드는 나중에 추가 예정
} 