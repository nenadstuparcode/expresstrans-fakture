import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { ClientsService, ICommonResponse, ISearchParams, ISuccesResponse } from '@app/services/clients.service';
import { TableColumn } from '@app/shared/table-shared/table-shared.interface';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { DatePipe } from '@angular/common';
import { NotifyService } from '@app/services/notify.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { catchError, filter, finalize, take, takeUntil, tap } from 'rxjs/operators';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { PageEvent } from '@angular/material/paginator';
import { IClient } from '@app/services/clients.interface';
import { CountryPipe } from '@app/common/country.pipe';
import { IndicatorComponent } from '@app/shared/indicator/indicator.component';
import { TruncateWithCountPipe } from '@app/common/truncate-pipe';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientListComponent {
  public componentDestroyed$: Subject<void> = new Subject<void>();
  public isLoadingResults$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public hasErrorLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public totalDataCount: number | null = null;
  public pageIndex: number = 0;
  public data$: BehaviorSubject<IClient[]> = new BehaviorSubject<IClient[]>([]);
  public params: ISearchParams = {
    searchTerm: '',
    searchSkip: 0,
    searchLimit: 10,
    sort: { createdAt: -1 },
    sortBy: 'createdAt',
    sortOrder: -1,
  };

  public columnsConfig: TableColumn[] = [
    {
      field: 'position',
      caption: 'Br',
      customClass: '',
      align: 'left',
      width: '15px',
      cell: (element: Record<string, any>) => element['position'],
    },
    {
      field: 'name',
      caption: 'Naziv',
      customClass: '',
      align: 'left',
      width: '250px',
      cell: (element: Record<string, any>) => element['name'],
    },
    {
      field: 'address',
      caption: 'Adresa',
      customClass: '',
      width: '120px',
      align: 'left',
      cell: (element: Record<string, any>) => element['address'],
    },
    {
      field: 'city',
      caption: 'Grad',
      customClass: '',
      width: '120px',
      align: 'left',
      cell: (element: Record<string, any>) => element['city'],
    },
    {
      field: 'country',
      caption: 'Država',
      customClass: '',
      width: '200px',
      align: 'left',
      cell: (element: Record<string, any>) => element['country'],
    },
    {
      field: 'phone',
      caption: 'Telefon',
      customClass: '',
      width: '80px',
      align: 'left',
      cell: (element: Record<string, any>) => element['phone'],
    },
    {
      field: 'hasInvoiceToPay',
      caption: 'Plaćanje',
      customClass: '',
      width: '60px',
      align: 'right',
      cell: (element: Record<string, any>) => element['hasInvoiceToPay'],
      customComponent: IndicatorComponent,
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
    private ds: ClientsService,
    private datePipe: DatePipe,
    private ns: NotifyService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private countryPipe: CountryPipe,
    private truncatePipe: TruncateWithCountPipe,
  ) {}

  public ngOnInit(): void {
    this.searchClients(this.params);
    this.ns.shouldSave
      .pipe(
        filter((action: Action) => action === Action.reload),
        tap(() => this.searchClients(this.params)),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();
  }

  public searchClients(params: ISearchParams): void {
    this.isLoadingResults$.next(true);
    this.hasErrorLoading$.next(false);
    this.ds
      .searchClients(params)
      .pipe(
        filter((response: ICommonResponse<IClient[]>) => !!response),
        tap((response: ICommonResponse<IClient[]>) => {
          this.totalDataCount = response.count;
          this.data$.next(
            response.data.map((client: IClient, index: number) => ({
              ...client,
              position: index + 1 + this.params.searchSkip,
              createdAt: this.datePipe.transform(client.createdAt, 'dd.MM.YYYY'),
              country: this.countryPipe.transform(client.country),
              info: this.truncatePipe.transform(client.info, ['10']),
              address: this.truncatePipe.transform(client.address, ['10']),
              city: this.truncatePipe.transform(client.city, ['15']),
              name: this.truncatePipe.transform(client.name, ['25']),
              phone: this.truncatePipe.transform(client.phone, ['12']),
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
    this.searchClients(this.params);
  }

  public onSearch(params: ISearchParams): void {
    this.params = params;
    this.searchClients(this.params);
  }

  public rowClick(itemId: string): void {
    this.view(itemId);
  }

  public async deleteModal(client: any, event?: any): Promise<void> {
    console.log(client);
    event.preventDefault();
    event.stopImmediatePropagation();

    const alert: HTMLIonAlertElement = await this.alertCtrl.create({
      header: 'Brisanje',
      message: `Da li ste sigurni da želite da obrišete klijenta ${client.name}?`,
      buttons: [
        {
          text: 'Otkaži',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Obriši',
          handler: () => this.delete(client._id),
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

  public delete(itemId: any): void {
    this.loading('Brisanje...')
      .then(() => {
        this.ds
          .deleteClient(itemId)
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
    this.router.navigate([`client/edit/${itemId}`]);
  }

  public view(itemId: string, event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    this.router.navigate([`client/view/${itemId}`]);
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
