import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateLogAppController } from './update-log-app.controller';
import { UpdateLogAppService } from './update-log-app.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    AuthModule
  ],
  controllers: [UpdateLogAppController],
  providers: [UpdateLogAppService]
})
export class UpdateLogAppModule {} 