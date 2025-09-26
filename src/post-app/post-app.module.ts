import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostAppController } from './post-app.controller';
import { PostAppService } from './post-app.service';
import { AuthModule } from '../auth/auth.module';
import { PostApp } from 'src/entities/post-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostApp]),
    AuthModule
  ],
  controllers: [PostAppController],
  providers: [PostAppService]
})
export class PostAppModule {} 