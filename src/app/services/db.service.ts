import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICommonResponse } from '@app/services/clients.service';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  providedIn: 'root',
})
export class DbService {
  private _router = inject(Router);
  public http: HttpClient = inject(HttpClient);
  _databases: BehaviorSubject<IDatabase[]> = new BehaviorSubject<IDatabase[]>([]);

  public dbList(): Observable<IDatabase[]> {
    return this.http
      .get(`${environment.apiUrl}/db/list`)
      .pipe(map((response: ICommonResponse<IDatabase[]>) => {
        this._databases.next(response.data.filter((db: IDatabase) => db.name.startsWith('etrans')));
        if(!localStorage.getItem('db')) {
          this.setDbConnection(environment.defaultDb, false);
        }

        return response.data;
      }));
  }

  public getCurrentDbConnection(): Observable<IDatabase> {
    return of(JSON.parse(localStorage.getItem('db')) ?? null);
  }

  public setDbConnection(dbName: string, reload: boolean = false): void {
    if(this._databases.getValue().length) {
      const selectedDb: IDatabase = this._databases.getValue().find((value: IDatabase) => value.name === dbName);
      localStorage.setItem('db', JSON.stringify(selectedDb));

      setTimeout(() => {
        reload && window.location.reload();
      }, 1200)
    }
  }
}
