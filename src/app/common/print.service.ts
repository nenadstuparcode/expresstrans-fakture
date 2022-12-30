import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "@env/environment";
import {map} from "rxjs/operators";
export interface IPrintOption {
  name: string;
  id: number;
}
@Injectable({
  providedIn: 'any',
})
export class PrintService {
  constructor(private http: HttpClient) {}
  public printingOptions: IPrintOption[] = [
    {
      name: 'Izvoz domaći kupci',
      id: 1,
    },
    {
      name: 'Uvoz dvije relacije',
      id: 2,
    },
    {
      name: 'Uvoz jedna relacija',
      id: 3,
    },
    {
      name: 'Strani kupci na srpskom',
      id: 4,
    },
    {
      name: 'Fakture sa PDV-om',
      id: 5,
    },
    {
      name: 'Vanredne autobus',
      id: 6,
    },
    {
      name: 'Fakture za autobus KM',
      id: 7,
    },
    {
      name: 'Fakture za autobus EUR',
      id: 8,
    },
  ];

  public reportMonths(): Observable<ArrayBuffer> {
    const httpOptions: any = {
      responseType: 'arraybuffer' as 'json',
    };

    return this.http.post(`${ environment.apiUrl}/invoice/report-months`, {}, httpOptions).pipe(
      map((data: ArrayBuffer) => {
        return data;
      }),
    );
  }

  public reportNotPaid(): Observable<ArrayBuffer> {
    const httpOptions: any = {
      responseType: 'arraybuffer' as 'json',
    };

    return this.http.post(`${ environment.apiUrl}/invoice/report-not-paid`, {}, httpOptions).pipe(
      map((data: ArrayBuffer) => {
        return data;
      }),
    );
  }

  public reportByClients(): Observable<ArrayBuffer> {
    const httpOptions: any = {
      responseType: 'arraybuffer' as 'json',
    };

    return this.http.post(`${ environment.apiUrl}/invoice/report-by-clients`, {}, httpOptions).pipe(
      map((data: ArrayBuffer) => {
        return data;
      }),
    );
  }

  public reportAll(): Observable<ArrayBuffer> {
    const httpOptions: any = {
      responseType: 'arraybuffer' as 'json',
    };

    return this.http.post(`${ environment.apiUrl}/invoice/report-all`, {}, httpOptions).pipe(
      map((data: ArrayBuffer) => {
        return data;
      }),
    );
  }
}
