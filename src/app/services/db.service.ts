import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICommonResponse } from '@app/services/clients.service';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface IDatabase {
  name: string;
  sizeOnDisk: number;
  empty: boolean;
  selected: boolean;
}

export interface IConnection {
  name: string;
  connectionTime: string;
}

@Injectable({
  providedIn: 'any',
})
export class DbService {
  public http: HttpClient = inject(HttpClient);

  public dbList(): Observable<IDatabase[]> {
    return this.http
      .get(`${environment.apiUrl}/db/list`)
      .pipe(map((response: ICommonResponse<IDatabase[]>) => response.data));
  }

  public getCurrentDbConnection(): Observable<IConnection> {
    return this.http
      .get(`${environment.apiUrl}/db/current`)
      .pipe(map((response: ICommonResponse<IConnection>) => response.data));
  }

  public setDbConnection(dbName): Observable<IConnection> {
    return this.http
      .get(`${environment.apiUrl}/db/connect/${dbName}`)
      .pipe(map((response: ICommonResponse<IConnection>) => response.data));
  }
}
