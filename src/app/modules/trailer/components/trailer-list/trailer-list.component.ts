import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { DriversService, ITrailer } from '@app/services/drivers.service';
import { ICommonResponse, ISearchParams, ISuccesResponse } from '@app/services/clients.service';
import { TableColumn } from '@app/shared/table-shared/table-shared.interface';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { DatePipe } from '@angular/common';
import { NotifyService } from '@app/services/notify.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { catchError, filter, finalize, take, takeUntil, tap } from 'rxjs/operators';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-trailer-list',
  templateUrl: './trailer-list.component.html',
  styleUrls: ['./trailer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailerListComponent {
  public componentDestroyed$: Subject<void> = new Subject<void>();
  public isLoadingResults$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public hasErrorLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public totalDataCount: number | null = null;
  public pageIndex: number = 0;
  public data$: BehaviorSubject<ITrailer[]> = new BehaviorSubject<ITrailer[]>([]);
  public params: ISearchParams = {
    searchTerm: '',
    searchSkip: 0,
    searchLimit: 10,
    sortBy: '',
    sortOrder: -1,
  };

  public columnsConfig: TableColumn[] = [
    {
      field: 'position',
      caption: 'Br',
      customClass: '',
      align: 'left',
      width: '80px',
      cell: (element: Record<string, any>) => element['position'],
    },
    {
      field: 'name',
      caption: 'Ime vozača',
      customClass: '',
      align: 'left',
      width: '200px',
      cell: (element: Record<string, any>) => element['name'],
    },
    {
      field: 'createdAt',
      caption: 'Kreirano',
      customClass: '',
      align: 'left',
      cell: (element: Record<string, any>) => element['createdAt'],
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
    private ds: DriversService,
    private datePipe: DatePipe,
    private ns: NotifyService,
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) {}
  public ngOnInit(): void {
    this.searchTrailers(this.params);
    this.ns.shouldSave
      .pipe(
        filter((action: Action) => action === Action.reload),
        tap(() => this.searchTrailers(this.params)),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();
  }

  public searchTrailers(params: ISearchParams): void {
    this.isLoadingResults$.next(true);
    this.hasErrorLoading$.next(false);
    this.ds
      .searchTrailers(params)
      .pipe(
        filter((response: ICommonResponse<ITrailer[]>) => !!response),
        tap((response: ICommonResponse<ITrailer[]>) => {
          this.totalDataCount = response.count;
          this.data$.next(
            response.data.map((trailer: ITrailer, index: number) => ({
              ...trailer,
              position: index + 1 + this.params.searchSkip,
              createdAt: this.datePipe.transform(trailer.createdAt, 'dd.MM.YYYY'),
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
    this.searchTrailers(this.params);
  }

  public onSearch(params: ISearchParams): void {
    this.params = params;
    this.searchTrailers(this.params);
  }

  public rowClick(itemId: string): void {
    this.view(itemId);
  }

  public async deleteModal(trailer: any, event?: any): Promise<void> {
    console.log(trailer);
    event.preventDefault();
    event.stopImmediatePropagation();

    const alert: HTMLIonAlertElement = await this.alertCtrl.create({
      header: 'Brisanje',
      message: `Da li ste sigurni da želite da obrišete prikolicu ${trailer.name}?`,
      buttons: [
        {
          text: 'Otkaži',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Obriši',
          handler: () => this.delete(trailer._id),
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
          .deleteTrailer(itemId)
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
    this.router.navigate([`trailer/edit/${itemId}`]);
  }

  public view(itemId: string, event?: any): void {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    this.router.navigate([`trailer/view/${itemId}`]);
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
