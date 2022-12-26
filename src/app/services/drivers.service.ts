import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {ICommonResponse, ISearchParams, ISuccesResponse} from "@app/services/clients.service";
import {Observable} from "rxjs";
import {filter, map, pluck} from "rxjs/operators";
import {IClient} from "@app/services/clients.interface";

export interface ITrailer {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface ICreateDriverResponse {
  _id: string;
  name: string;
}

export interface ICreateRelationResponse {
  _id: string;
  name: string;
}

export interface ICreateRelationPayload {
  name: string;
}

export interface ICreateDriverPayload {
  name: string;
}

export interface ICreateTrailerPayload {
  name: string;
}

export interface ICreateTrailerResponse {
  _id: string;
  name: string;
}

export interface ICreateDriverResponse {
  _id: string;
  name: string;
}

export interface IDriver {
  _id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
}

export interface ICreateVehicleResponse {
  _id: string;
  plateNumber: string;
}

export interface ICreateVehiclePayload {
  plateNumber: string;
}

export interface IVehicle {
  _id: string;
  plateNumber: string;
  createdAt: string;
  modifiedAt: string;
}

@Injectable({
  providedIn: 'any',
})
export class DriversService {
  constructor(private http: HttpClient) {}

  public createDriver(payload: ICreateDriverPayload): Observable<ICreateDriverResponse> {
    return this.http
      .post(`${environment.apiUrl}/driver`, payload)
      .pipe(map((data: ICommonResponse<ICreateDriverResponse>) => { return data.data }));
  }

  public getDrivers(): Observable<IDriver[]> {
    return this.http.get(`${environment.apiUrl}/driver`).pipe(
      map((data: ICommonResponse<IDriver[]>) => { return data }),
      pluck('data'),
    );
  }

  public getDriver(id: string): Observable<ICommonResponse<IDriver>> {
    return this.http.get(`${environment.apiUrl}/driver/${id}`).pipe(
      filter((data: ICommonResponse<IDriver>) => !!data),
    );
  }

  public getTrailer(id: string): Observable<ICommonResponse<ITrailer>> {
    return this.http.get(`${environment.apiUrl}/trailer/${id}`).pipe(
      filter((data: ICommonResponse<ITrailer>) => !!data),
    )
  }

  public updateDriver(payload: ICreateDriverPayload, id: string): Observable<IDriver> {
    return this.http
      .put(`${environment.apiUrl}/driver/${id}`, payload)
      .pipe(map((data: ICommonResponse<IDriver>) => { return data.data }));
  }

  public deleteDriver(id: string): Observable<ICreateDriverResponse> {
    return this.http.delete(`${environment.apiUrl}/driver/${id}`).pipe(
      map((data: ICommonResponse<ICreateDriverResponse>) => { return data }),
      pluck('data'),
    );
  }

  // Vehicle API
  public createVehicle(payload: ICreateVehiclePayload): Observable<ICreateVehicleResponse> {
    return this.http
      .post(`${environment.apiUrl}/vehicle`, payload)
      .pipe(map((data: ICommonResponse<ICreateVehicleResponse>) => { return data.data }));
  }

  public getVehicles(): Observable<IVehicle[]> {
    return this.http.get(`${environment.apiUrl}/vehicle`).pipe(
      map((data: ICommonResponse<IVehicle[]>) => { return data }),
      pluck('data'),
    );
  }

  public getVehicle(id: string): Observable<ICommonResponse<IVehicle>> {
    return this.http
      .get(`${environment.apiUrl}/vehicle/${id}`)
      .pipe(map((data: ICommonResponse<IVehicle>) => { return data }));
  }

  public updateVehicle(payload: ICreateVehiclePayload, id: string): Observable<IVehicle> {
    return this.http
      .put(`${environment.apiUrl}/vehicle/${id}`, payload)
      .pipe(map((data: ICommonResponse<IVehicle>) => { return data.data }));
  }

  public deleteVehicle(id: string): Observable<ICreateVehicleResponse> {
    return this.http.delete(`${environment.apiUrl}/vehicle/${id}`).pipe(
      map((data: ICommonResponse<ICreateVehicleResponse>) => { return data }),
      pluck('data'),
    );
  }

  public getTrailers(): Observable<ITrailer[]> {
    return this.http.get(`${environment.apiUrl}/trailer`).pipe(
      map((response: ICommonResponse<ITrailer[]>) => { return response.data }),
    );
  }

  public deleteTrailer(id: string): Observable<ISuccesResponse> {
    return this.http.delete(`${environment.apiUrl}/trailer/${id}`).pipe(
      map((data: ISuccesResponse) => data),
    )
  }

  public updateTrailer(payload: ICreateTrailerPayload, id: string): Observable<ITrailer> {
    return this.http.put(`${environment.apiUrl}/trailer/${id}`, payload).pipe(
      map((data: ICommonResponse<ITrailer>) => { return data }),
      pluck('data'),
    );
  }

  public createTrailer(payload: ICreateTrailerPayload): Observable<ITrailer> {
    return this.http.post(`${environment.apiUrl}/trailer`, payload).pipe(
      map((data: ICommonResponse<ITrailer>) => { return data }),
      pluck('data'),
    );
  }

  public searchDrivers(data: ISearchParams): Observable<ICommonResponse<IDriver[]>> {
    return this.http.post(`${environment.apiUrl}/driver/search`, data).pipe(
      map((response: ICommonResponse<IDriver[]>) => {
        return response;
      })
    );
  }

  public searchTrailers(data: ISearchParams): Observable<ICommonResponse<ITrailer[]>> {
    return this.http.post(`${environment.apiUrl}/trailer/search`, data).pipe(
      map((response: ICommonResponse<ITrailer[]>) => {
        console.log(response);
        return response;
      })
    );
  }

  public searchVehicles(data: ISearchParams): Observable<ICommonResponse<IVehicle[]>> {
    return this.http.post(`${environment.apiUrl}/vehicle/search`, data).pipe(
      map((response: ICommonResponse<IVehicle[]>) => {
        return response;
      })
    );
  }
}
