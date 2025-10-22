import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import helmet from 'helmet';
import * as hpp from 'hpp';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Express 보안 기본값 강화
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(helmet());
  app.use(hpp());
  app.use(compression());

  // CORS 제한 (현재 운영/개발 도메인만 허용)
  app.enableCors({
    origin: [
      'http://cozcozy.co.kr:3508',
      'https://cozcozy.co.kr',
    ],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
    maxAge: 86400,
  });
  
  // 전역 프리픽스 설정으로 루트 노출 최소화
  app.setGlobalPrefix('api');

  // 전역 파이프 설정 (더 엄격)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }));

  // 전역 예외 필터 설정
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3508, '0.0.0.0');
}
bootstrap();
