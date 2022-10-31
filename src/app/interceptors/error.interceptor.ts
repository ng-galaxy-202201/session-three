import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

const controlledErrors = new Map([
  ['ERR0001', 'El usuario no existe'],
  ['ERR0002', 'Email registrado anteriormente']
])

const statusErrors = new Map([
  [0, 'Error en el frontend'],
  [401, 'Usuario no autorizado'],
  [404, 'Recurso no encontrado'],
  [500, 'Error en el servidor']
])

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log(err.status); // 400, 401, 500
        console.log(err.error.code); // ERR0001, ERR0002

        let message = '';
        if (err.error.code) {
          message = controlledErrors.get(err.error.code) || '';
        } else {
          message = statusErrors.get(err.status) || '';
        }

        if (!message) {
          message = 'Ocurrio un error inesperado';
        }

        // alert.open(message)
        // modal.open(message)

        alert(message)
        return throwError(() => err);
      })
    );
  }
}
