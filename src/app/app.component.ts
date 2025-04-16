import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { GeneralDataService } from '@app/services/general-data.service';
import { DbService, IDatabase } from '@app/services/db.service';
import { Observable } from 'rxjs';
import { mergeMap, take, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
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
  dbs$: Observable<IDatabase[]> = this.dbService._databases;
  selectedDb: IDatabase = null;

  public ngOnInit(): void {
    this.gds.preloadGeneralData();
    this.loadDbs();
  }

  public loadDbs(): void {
    this.dbService.dbList().pipe(
      mergeMap(() => this.dbService.getCurrentDbConnection()),
      tap((db: IDatabase) => this.selectedDb = db),
      take(1)).subscribe();
  }

  public connectToDb(change: any): void {
    this.dbService.setDbConnection(change.detail.value, true);
  }
}
