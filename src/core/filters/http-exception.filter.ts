import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = '서버 오류가 발생했습니다.';
    
    // 에러 응답이 문자열인 경우 (예: throw new HttpException('에러 메시지', HttpStatus.BAD_REQUEST))
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } 
    // 에러 응답이 객체인 경우 (예: throw new HttpException({ message: '에러 메시지' }, HttpStatus.BAD_REQUEST))
    else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if ('message' in exceptionResponse) {
        message = Array.isArray(exceptionResponse.message) 
          ? exceptionResponse.message[0] 
          : exceptionResponse.message;
      }
    }

    response.status(status).json({
      success: false,
      message: message
    });
  }
} 