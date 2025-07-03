import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventAppController } from './event-app.controller';
import { EventAppService } from './event-app.service';
import { EventApp } from '../entities/event-app.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventApp]),
    AuthModule
  ],
  controllers: [EventAppController],
  providers: [EventAppService]
})
export class EventAppModule {} 