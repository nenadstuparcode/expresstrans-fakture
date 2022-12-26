import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { filter, map, pluck } from 'rxjs/operators';
import { ICommonResponse, ISearchParams } from '@app/services/clients.service';
import {
  ICreateRelationPayload,
  ICreateRelationResponse
} from '@app/services/drivers.service';
import { Relation } from '@app/modules/invoice/invoice.interface';

@Injectable({
  providedIn: 'any',
})
export class RelationsService {
  constructor(private http: HttpClient) {}

  public getRelations(): Observable<Relation[]> {
    return this.http.get(`${environment.apiUrl}/relation`).pipe(
      map((data: ICommonResponse<Relation[]>) => {
        return data;
      }),
      pluck('data'),
    );
  }

  public getRelation(id: string): Observable<ICommonResponse<Relation>> {
    return this.http
      .get(`${environment.apiUrl}/relation/${id}`)
      .pipe(filter((data: ICommonResponse<Relation>) => !!data));
  }

  public updateRelation(payload: ICreateRelationPayload, id: string): Observable<Relation> {
    return this.http.put(`${environment.apiUrl}/relation/${id}`, payload).pipe(
      map((data: ICommonResponse<Relation>) => {
        return data.data;
      }),
    );
  }

  public deleteRelation(id: string): Observable<ICreateRelationPayload> {
    return this.http.delete(`${environment.apiUrl}/relation/${id}`).pipe(
      map((data: ICommonResponse<ICreateRelationResponse>) => {
        return data;
      }),
      pluck('data'),
    );
  }

  public createRelation(payload: ICreateRelationPayload): Observable<ICreateRelationResponse> {
    return this.http
      .post(`${environment.apiUrl}/relation`, payload)
      .pipe(map((data: ICommonResponse<ICreateRelationResponse>) => { return data.data }));
  }

  public searchRelations(data: ISearchParams): Observable<ICommonResponse<Relation[]>> {
    return this.http.post(`${environment.apiUrl}/relation/search`, data).pipe(
      map((response: ICommonResponse<Relation[]>) => {
        return response;
      }),
    );
  }
}
