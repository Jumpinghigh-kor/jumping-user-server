import { Module } from '@nestjs/common';
import { CommonCodeController } from './common-code.controller';
import { CommonCodeService } from './common-code.service';

@Module({
  controllers: [CommonCodeController],
  providers: [CommonCodeService],
  exports: [CommonCodeService]
})
export class CommonCodeModule {} 