import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberSearchAppController } from './member-search-app.controller';
import { MemberSearchAppService } from './member-search-app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([])
  ],
  controllers: [MemberSearchAppController],
  providers: [MemberSearchAppService],
})
export class MemberSearchAppModule {} 