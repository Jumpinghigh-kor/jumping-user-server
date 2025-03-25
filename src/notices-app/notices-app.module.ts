import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticesAppController } from './notices-app.controller';
import { NoticesAppService } from './notices-app.service';
import { NoticesApp } from '../entities/notices-app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoticesApp]),
    AuthModule
  ],
  controllers: [NoticesAppController],
  providers: [NoticesAppService]
})
export class NoticesAppModule {} 