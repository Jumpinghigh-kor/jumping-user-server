import { Module } from '@nestjs/common';
import { MemberImgFileController } from './member-img-file.controller';
import { MemberImgFileService } from './member-img-file.service';

@Module({
  controllers: [MemberImgFileController],
  providers: [MemberImgFileService],
})
export class MemberImgFileModule {} 