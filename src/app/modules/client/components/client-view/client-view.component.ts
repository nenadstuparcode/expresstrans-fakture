import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, filter, finalize, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { ClientsService, ICommonResponse, ISearchParams, ISuccesResponse } from '@app/services/clients.service';
import { IClient } from '@app/services/clients.interface';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { IInvoice, InvoiceType } from '@app/modules/invoice/invoice.interface';
import { TableColumn } from '@app/shared/table-shared/table-shared.interface';
import { InvoiceTypeComponent } from '@app/shared/invoice-type/invoice-type.component';
import { RelationsComponent } from '@app/shared/relations/relations.component';
import { CheckboxComponent } from '@app/shared/checkbox/checkbox.component';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { InvoiceService } from '@app/modules/invoice/invoice.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NotifyService } from '@app/services/notify.service';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { ClientPipe } from '@app/common/client.pipe';
import { DriverPipe } from '@app/common/driver.pipe';
import {IPrintOption, PrintService} from '@app/common/print.service';
import { PageEvent } from '@angular/material/paginator';
import {IFilter} from "@app/modules/invoice/components/invoice-list/invoice-list.component";

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss'],
})
export class ClientViewComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  public client$: BehaviorSubject<IClient> = new BehaviorSubject<IClient>(null);
  public error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isLoadingResults$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public hasErrorLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public totalDataCount: number | null = null;
  public pageIndex: number = 0;
  public printOptions = this.printService.printingOptions;
  public invoices: IInvoice[] = [];
  public data$: Subject<IInvoice[]> = new Subject<IInvoice[]>();
  public clientId: string = '';
  public params: ISearchParams = {
    searchTerm: '',
    searchSkip: 0,
    searchLimit: 10,
    sortBy: '',
    sortOrder: -1,
    clientId: this.clientId,
  };

  public filters: IFilter[] = [
    {
      name: 'Prvo najnoviji',
      value: { createdAt: -1},
    },
    {
      name: 'Prvo najstariji',
      value: { createdAt: 1},
    },
    {
      name: 'Prvo placene',
      value: { payed: -1 },
    },
    {
      name: 'Prvo neplacene',
      value: { payed: 1 },
    },
  ];

  public columnsConfig: TableColumn[] = [
    {
      field: 'position',
      caption: 'Br',
      customClass: '',
      align: 'left',
      width: '50px',
      cell: (element: Record<string, any>) => element['position'],
    },
    {
      field: 'invoicePublicId',
      caption: 'Br.Fk.',
      customClass: '',
      align: 'left',
      width: '50px',
      cell: (element: Record<string, any>) => element['invoicePublicId'],
      sticky: true,
    },
    {
      field: 'invoiceType',
      caption: 'Usluga',
      customClass: '',
      align: 'left',
      width: '40px',
      cell: (element: Record<string, any>) => element['invoiceType'],
      customComponent: InvoiceTypeComponent,
    },
    {
      field: 'clientId',
      caption: 'Ime klijenta',
      customClass: '',
      align: 'left',
      width: '180px',
      cell: (element: Record<string, any>) => element['clientId'],
    },
    {
      field: 'invoiceRelations',
      caption: 'Relacije',
      customClass: '',
      align: 'left',
      width: '220px',
      cell: (element: Record<string, any>) => element['clientId'],
      customComponent: RelationsComponent,
    },
    {
      field: 'invoiceDateStart',
      caption: 'Datum Fakture',
      customClass: '',
      width: '90px',
      align: 'left',
      cell: (element: Record<string, any>) => element['invoiceDateStart'],
    },
    {
      field: 'invoiceDateReturn',
      caption: 'Datum istovara/povratka',
      customClass: '',
      width: '90px',
      align: 'left',
      cell: (element: Record<string, any>) => element['invoiceDateReturn'],
    },
    {
      field: 'invDriver',
      caption: 'Vozač',
      customClass: '',
      width: '150px',
      align: 'left',
      cell: (element: Record<string, any>) => element['invDriver'],
    },
    {
      field: 'payed',
      caption: 'Plaćeno',
      customClass: '',
      width: '50px',
      align: 'right',
      cell: (element: Record<string, any>) => element['payed'],
      clickFn: (data: any, event: any) => this.updatePayment(data, event),
      customComponent: CheckboxComponent,
    },
    {
      field: 'bam',
      caption: 'KM',
      customClass: '',
      width: '70px',
      align: 'right',
      cell: (element: Record<string, any>) => element['bam'],
    },
    {
      field: 'eur',
      caption: 'EUR',
      customClass: '',
      width: '70px',
      align: 'right',
      cell: (element: Record<string, any>) => element['v'],
    },
    {
      field: 'print',
      caption: '',
      width: '30px',
      customClass: '',
      align: 'right',
      cell: (element: Record<string, any>) => element['_id'],
      clickFn: (data: any, event: any) => this.presentActionSheet(data, event),
      setTemplate: (element: Record<string, any>) =>
        this.sanitizePipe.transform("<button class='mat-stroked-button table-button'>Štampaj</button>") as string,
    },
    {
      field: 'delete',
      caption: '',
      width: '20px',
      customClass: '',
      align: 'right',
      cell: (element: Record<string, any>) => element['_id'],
      clickFn: (data: any, event: any) => this.deleteModal(data, event),
      setTemplate: (element: Record<string, any>) =>
        this.sanitizePipe.transform("<button class='mat-stroked-button table-button'>Obriši</button>") as string,
    },
  ];
  public displayedColumns: string[] = this.columnsConfig.map((col: TableColumn) => col.field);

  constructor(
    private sanitizePipe: SanitizeHtmlPipe,
    private is: InvoiceService,
    private ds: ClientsService,
    private actRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private ns: NotifyService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private clientPipe: ClientPipe,
    private driverPipe: DriverPipe,
    private actionSheetCtrl: ActionSheetController,
    private printService: PrintService,
    private currencyPipe: CurrencyPipe,
  ) {}

  public ngOnInit(): void {
    this.actRoute.paramMap
      .pipe(
        filter((data: ParamMap) => !!data),
        switchMap((data: ParamMap) => this.ds.getClientDetail(data.get('id'))),
        filter((client: IClient) => !!client && !this.isEmpty(client)),
        tap((client: IClient) => {
          this.client$.next(client);
          this.clientId = client._id;
          this.searchInvoices({...this.params, clientId: client._id});
          this.ns.shouldSave
            .pipe(
              filter((action: Action) => action === Action.reload),
              tap(() => this.searchInvoices({...this.params, clientId: client._id})),
              takeUntil(this.componentDestroyed$),
            )
            .subscribe();
        }),
        catchError((err: Error) => {
          this.client$.next(null);
          this.error$.next(true);
          return throwError(err);
        }),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();
  }

  public searchInvoices(params: ISearchParams): void {
    this.isLoadingResults$.next(true);
    this.hasErrorLoading$.next(false);
    this.is
      .searchInvoices(params)
      .pipe(
        filter((response: ICommonResponse<IInvoice[]>) => !!response),
        tap((response: ICommonResponse<IInvoice[]>) => {
          this.totalDataCount = response.count;
          this.invoices = [...response.data];
          this.data$.next(
            response.data.map((invoice: IInvoice, index: number) => ({
              ...invoice,
              position: index + 1 + this.params.searchSkip,
              createdAt: this.datePipe.transform(invoice.createdAt, 'dd.MM.YYYY'),
              clientId: this.clientPipe.transform(invoice.clientId),
              invoiceDateStart: this.datePipe.transform(invoice.invoiceDateStart, 'dd.MM.YYYY'),
              invoiceDateReturn: this.datePipe.transform(invoice.invoiceDateReturn, 'dd.MM.YYYY'),
              invDriver: this.driverPipe.transform(invoice.invDriver),
              type: invoice.invoiceType === InvoiceType.bus ? 'TP' : 'TR',
              bam: this.currencyPipe.transform(invoice.priceKm, 'KM'),
              eur: this.currencyPipe.transform(invoice.priceEuros, 'EUR'),
              tax: this.currencyPipe.transform(invoice.priceKmTax, 'KM'),
            })),
          );
        }),
        finalize(() => this.isLoadingResults$.next(false)),
        catchError((error: Error) => {
          this.isLoadingResults$.next(false);
          this.hasErrorLoading$.next(true);

          return throwError(error);
        }),
        take(1),
      )
      .subscribe();
  }

  public handlePageEvent(event: PageEvent): void {
    this.params.searchLimit = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.params.searchSkip = event.pageIndex * event.pageSize;
    this.searchInvoices({...this.params, clientId: this.clientId});
  }

  public onSearch(params: ISearchParams): void {
    this.params = {...params, clientId: this.clientId};
    this.searchInvoices(this.params);
  }

  public rowClick(itemId: string): void {
    this.view(itemId);
  }

  public async deleteModal(invoice: IInvoice, event?: any): Promise<void> {
    console.log(invoice);
    event.preventDefault();
    event.stopImmediatePropagation();

    const alert: HTMLIonAlertElement = await this.alertCtrl.create({
      header: 'Brisanje',
      message: `Da li ste sigurni da želite da obrišete fakturu ${invoice.invoicePublicId}?`,
      buttons: [
        {
          text: 'Otkaži',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Obriši',
          handler: () => this.delete(invoice._id),
        },
      ],
    });

    await alert.present();
  }

  public async loading(msg: string): Promise<void> {
    const loading: HTMLIonLoadingElement = await this.loadingCtrl.create({
      message: msg,
    });

    await loading.present();
  }

  public printInvoice(id: string, option: number): void {
    console.log(id, option);
    //TODO print invoice
  }

  async presentActionSheet(data: IInvoice, event: any) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opcija štampanja',
      subHeader: 'Izaberi opciju za štampanje',
      buttons: [
        ...this.printOptions.map((o: IPrintOption) => {
          return {
            text: o.name,
            cssClass: 'secondary',
            handler: () => this.printInvoice(data._id, o.id),
          };
        }),
        {
          text: 'Odustani',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();
  }

  public printInvoiceModal(data: IInvoice, event: any): void {
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  public delete(itemId: any): void {
    this.loading('Brisanje...')
      .then(() => {
        this.is
          .deleteInvoice(itemId)
          .pipe(
            tap((response: ISuccesResponse) => {
              this.ns.shouldSave.next(Action.reload);
              this.loadingCtrl.dismiss();
            }),
            take(1),
            catchError((err: Error) => {
              this.loadingCtrl.dismiss();
              return throwError(err);
            }),
          )
          .subscribe();
      })
      .catch((err: Error) => {
        this.loadingCtrl.dismiss();

        return throwError(err);
      });
  }

  public edit(itemId: string, event: any): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.router.navigate([`invoice/edit/${itemId}`]);
  }

  public view(itemId: string, event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    this.router.navigate([`invoice/view/${itemId}`]);
  }

  public async presetLoading(msg): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: msg,
    });

    await loading.present();
  }

  public updatePayment(inv: IInvoice, event: any): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    const selectedInvoice: IInvoice = this.invoices.find((invoice: IInvoice) => invoice._id === inv._id);
    this.presetLoading('Ažuriranje plaćanja')
      .then(() => {
        this.is
          .updateInvoice({ ...selectedInvoice, payed: !inv.payed }, inv._id)
          .pipe(
            tap(() => {
              this.ns.shouldSave.next(Action.reload);
              this.loadingCtrl.dismiss();
            }),
            take(1),
            catchError((err: Error) => {
              this.loadingCtrl.dismiss();
              return throwError(err);
            }),
          )
          .subscribe();
      })
      .catch((err) => {
        this.loadingCtrl.dismiss();
        return throwError(err);
      });
  }

  public onAction(action: Action): void {
    switch (action) {
      case Action.cancel:
        this.router.navigate(['client']);
    }
  }

  public isEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
