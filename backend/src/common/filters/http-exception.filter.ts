// src/common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StudentAlreadyAssignedError } from '../errors/student-already-assigned.error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Unerwarteter Fehler';

    if (exception instanceof StudentAlreadyAssignedError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'STUDENT_ALREADY_ASSIGNED';
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();
      // resp kann string oder Objekt sein
      if (typeof resp === 'string') {
        message = resp;
      } else if (resp && typeof resp === 'object') {
        message = (resp as any).message ?? message;
      }
      code = HttpStatus[status] ?? 'HTTP_ERROR';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    res.status(status).json({
      statusCode: status,
      code,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
