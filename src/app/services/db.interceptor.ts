import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class DbInterceptor implements HttpInterceptor {
  // public createDbHeaders(headers: Headers): Headers {
  //   if (localStorage.getItem('db')) {
  //     const dbConnection: IConnection = JSON.parse(localStorage.getItem('db'));
  //
  //     if (dbConnection.name) {
  //       headers.append('X-DB-ID', dbConnection.name);
  //     }
  //
  //     return headers;
  //   }
  // }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedReq: HttpRequest<any> = request.clone({
      headers: request.headers.append(
        'X-DB-ID',
        localStorage.getItem('db') && JSON.parse(localStorage.getItem('db'))?.name
          ? JSON.parse(localStorage.getItem('db')).name
          : environment.defaultDb,
      ),
    });

    return next.handle(clonedReq);
  }
}
