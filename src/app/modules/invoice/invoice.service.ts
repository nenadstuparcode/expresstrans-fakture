import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ICreateInvoicePayload, IInvoice} from "@app/modules/invoice/invoice.interface";
import {environment} from "@env/environment";
import {ICommonResponse, ISearchParams, ISuccesResponse} from "@app/services/clients.service";
import {map} from "rxjs/operators";

export interface IPrintInvoicePayload {
  printOption: string;
  clientId: string;
  invoiceId: string;
  signed: boolean;
}

@Injectable({
  providedIn: 'any',
})
export class InvoiceService {
  constructor(private http: HttpClient) {}
  public createInvoice(payload: ICreateInvoicePayload): Observable<IInvoice> {
    return this.http.post(`${environment.apiUrl}/invoice`, payload).pipe(
      map((response: ICommonResponse<IInvoice>) => {
        return response.data;
      })
    )
  }

  public updateInvoice(payload: ICreateInvoicePayload, id: string): Observable<IInvoice> {
    return this.http.put(`${environment.apiUrl}/invoice/${id}`, payload).pipe(
      map((response: ICommonResponse<IInvoice>) => {
        return response.data;
      })
    )
  }

  public searchInvoices(payload: ISearchParams): Observable<ICommonResponse<IInvoice[]>> {
    return this.http.post(`${environment.apiUrl}/invoice/search/v2`, payload).pipe(
      map((response: ICommonResponse<IInvoice[]>) => response),
    )
  }

  public deleteInvoice(inoviceId: string): Observable<ISuccesResponse> {
    return this.http.delete(`${environment.apiUrl}/invoice/${inoviceId}`).pipe(
      map((data: ISuccesResponse) => data),
    )
  }

  public printInvoice(payload: IPrintInvoicePayload): Observable<ArrayBuffer> {
    const httpOptions: any = {
      responseType: 'arraybuffer' as 'json',
    };

    return this.http.post(`${ environment.apiUrl}/invoice/print-pdf`, payload, httpOptions).pipe(
      map((data: ArrayBuffer) => {
        return data;
      }),
    );
  }

  public getInvoice(invoiceId: string): Observable<IInvoice> {
    return this.http.get(`${environment.apiUrl}/invoice/${invoiceId}`).pipe(
      map((response: ICommonResponse<IInvoice>) => {
        return response.data;
      }),
    )
  }
 }
