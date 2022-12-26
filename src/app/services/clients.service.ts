import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {IClient, IClientPayload} from '@app/services/clients.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';

export interface ICommonMetaResponse {
  _id: string | null;
  count: number;
  priceTotalKm: number;
  priceTotalEur: number;
}
export interface ICommonResponse<T> {
  status: 0 | 1;
  message: string;
  data: T;
  count?: number;
  meta?: ICommonMetaResponse;
}

export interface ISuccesResponse {
  status: 0 | 1;
  message: string;
}

export interface ISearchParams {
  searchTerm: string;
  searchSkip: number;
  searchLimit: number;
  sort?: any;
  sortBy?: string;
  sortOrder?: -1 | 1;
  clientId?: string;
}

@Injectable({
  providedIn: 'any',
})
export class ClientsService {
  constructor(private http: HttpClient) {}

  public getClients(): Observable<ICommonResponse<IClient[]>> {
    return this.http.get(`${environment.apiUrl}/client`).pipe(
      map((response: ICommonResponse<IClient[]>) => {
        return response;
      }),
    );
  }

  public searchClients(data: ISearchParams): Observable<ICommonResponse<IClient[]>> {
    return this.http.post(`${environment.apiUrl}/client/search`, data).pipe(
      map((response: ICommonResponse<IClient[]>) => {
        return response;
      })
    );
  }

  public getClientDetail(clientId: string): Observable<IClient> {
    return this.http.get(`${environment.apiUrl}/client/${clientId}`).pipe(
      map((response: ICommonResponse<IClient>) => {
        return response.data;
      }),
    );
  }

  public saveClient(payload: IClientPayload): Observable<IClient> {
    return this.http.post(`${environment.apiUrl}/client`, payload).pipe(
      map((response: ICommonResponse<IClient>) => {
        return response.data;
      })
    )
  }

  public updateClient(payload: IClientPayload, clientId: string): Observable<IClient> {
    return this.http.put(`${environment.apiUrl}/client/${clientId}`, payload).pipe(
      map((response: ICommonResponse<IClient>) => {
        return response.data;
      })
    )
  }

  public deleteClient(clientId: string): Observable<ISuccesResponse> {
    return this.http.delete(`${environment.apiUrl}/client/${clientId}`).pipe(
      map((response: ISuccesResponse) => {
        return response;
      })
    )
  }
}
