import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GeneralDataService } from '@app/services/general-data.service';
import { DbService, IConnection, IDatabase } from '@app/services/db.service';
import { BehaviorSubject, combineLatest, throwError } from 'rxjs';
import {catchError, delay, filter, finalize, map, take, tap} from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public appPages = [
    {
      title: 'Fakture',
      url: '/invoice',
      icon: 'document',
    },
    { title: 'Klijenti', url: '/client', icon: 'people' },
    { title: 'Vozila', url: '/vehicle', icon: 'car' },
    { title: 'Prikolice', url: '/trailer', icon: 'car' },
    { title: 'Vozači', url: '/driver', icon: 'people' },
    { title: 'Relacije', url: '/relation', icon: 'swap-horizontal' },
    { title: 'Izvještaji', url: '/settings', icon: 'settings' },
  ];
  private dbService: DbService = inject(DbService);
  private gds: GeneralDataService = inject(GeneralDataService);
  private datePipe: DatePipe = inject(DatePipe);
  dbs$: BehaviorSubject<IDatabase[]> = new BehaviorSubject<IDatabase[]>([]);
  currentConnection: IConnection = null;
  public ngOnInit(): void {
    this.gds.preloadGeneralData();
    this.loadDbs();
  }

  public loadDbs(): void {
    combineLatest([this.dbService.dbList().pipe(
      map((dbs: IDatabase[]) => (dbs.filter((db: IDatabase) => db.name.startsWith("etrans"))))
    ), this.dbService.getCurrentDbConnection()])
      .pipe(
        tap(([dbs, connection]: [IDatabase[], IConnection]) => {
          this.currentConnection = {
            ...connection,
            connectionTime: this.datePipe.transform(connection.connectionTime, 'dd/MM/YY u HH:mm'),
          };
          this.dbs$.next(
            dbs.map((db: IDatabase) => {
              return {
                ...db,
                selected: db.name === connection.name,
              };
            }),
          );
        }),
        catchError((err: Error) => {
          this.dbs$.next([]);
          return throwError(() => err);
        }),
        take(1),
      )
      .subscribe();
  }

  public connectToDb(data: CustomEvent): void {
    console.log(data.detail.value);
    this.dbService
      .setDbConnection(data.detail.value)
      .pipe(
        tap((connection: IConnection) => {
          this.currentConnection = connection;
        }),
        delay(2000),
        finalize(() => {
          document.location.reload();
        }),
        take(1),
      )
      .subscribe();
  }
}
