import {Injectable} from '@angular/core';
import {ClientsService, ICommonResponse} from '@app/services/clients.service';
import {BehaviorSubject, combineLatest, Observable, throwError} from 'rxjs';
import {IClient} from '@app/services/clients.interface';
import {catchError, filter, finalize, pluck, take, tap} from 'rxjs/operators';
import {LoadingController} from '@ionic/angular';
import {DriversService, IDriver, ITrailer, IVehicle} from '@app/services/drivers.service';
import {RelationsService} from "@app/services/relations.service";
import {Relation} from "@app/modules/invoice/invoice.interface";
import {LoadingService} from "@app/services/loading.service";
import {MessageType} from "@app/services/loading.interface";

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  constructor(private cs: ClientsService, private ls: LoadingService, private rs: RelationsService, private loadingCtrl: LoadingController, private ds: DriversService) {}

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private allClients$: BehaviorSubject<IClient[]> = new BehaviorSubject<IClient[]>([]);
  private allDrivers$: BehaviorSubject<IDriver[]> = new BehaviorSubject<IDriver[]>([]);
  private allVehicles$: BehaviorSubject<IVehicle[]> = new BehaviorSubject<IVehicle[]>([]);
  private allTrailers$: BehaviorSubject<ITrailer[]> = new BehaviorSubject<ITrailer[]>([]);
  private allRelations$: BehaviorSubject<Relation[]> = new BehaviorSubject<Relation[]>([]);

  public allClientsList$: Observable<IClient[]> = this.allClients$ as Observable<IClient[]>;
  public allDriversList$: Observable<IDriver[]> = this.allDrivers$ as Observable<IDriver[]>;
  public allVehiclesList$: Observable<IVehicle[]> = this.allVehicles$ as Observable<IVehicle[]>;
  public allTrailersList$: Observable<ITrailer[]> = this.allTrailers$ as Observable<ITrailer[]>;
  public allRelationsList$: Observable<Relation[]> = this.allRelations$ as Observable<Relation[]>;
  public allClients: IClient[] = [];
  public allDrivers: IDriver[] = [];
  public allRelations: Relation[] = [];

  public preloadGeneralData(): void {
    this.showLoading('Ucitavanje podataka')
      .then(() => {
        combineLatest([
          this.cs.getClients().pipe(pluck('data')),
          this.ds.getDrivers(),
          this.ds.getVehicles(),
          this.ds.getTrailers(),
          this.rs.getRelations(),
        ])
          .pipe(
            filter(
              ([clients, drivers, vehicles, trailers, relations]: [IClient[], IDriver[], IVehicle[], ITrailer[], Relation[]]) =>
                !!clients && !!drivers && !!vehicles,
            ),
            tap(([clients, drivers, vehicles, trailers, relations]: [IClient[], IDriver[], IVehicle[], ITrailer[], Relation[]]) => {
              this.allClients$.next(clients);
              this.allDrivers$.next(drivers);
              this.allVehicles$.next(vehicles);
              this.allTrailers$.next(trailers);
              this.allRelations$.next(relations);
              this.allClients = [...clients];
              this.allDrivers = [...drivers];
              this.allRelations = [...relations];
              this.loadingCtrl.dismiss();
            }),
            finalize(() => {
              this.loading$.next(false);
            }),
            catchError((err: Error) => {
              this.loadingCtrl.dismiss();
              this.loading$.next(false);
              this.ls.showToast(MessageType.err);

              return throwError(err);
            }),
            take(1),
          )
          .subscribe();
      })
      .catch((err: Error) => {
        this.loadingCtrl.dismiss();

        return throwError(err);
      });
  }
  public loadClients(): void {
    this.showLoading('Ucitavanje podataka')
      .then(() => {
        this.cs
          .getClients()
          .pipe(
            tap((response: ICommonResponse<IClient[]>) => {
              this.allClients$.next(response.data);
              this.loadingCtrl.dismiss();
            }),
            catchError((err: Error) => {
              this.loadingCtrl.dismiss();

              return throwError(err);
            }),
            take(1),
          )
          .subscribe();
      })
      .catch((err: Error) => {
        this.loadingCtrl.dismiss();

        return throwError(err);
      });
  }

  public async showLoading(msg: string): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Učitavanje podataka...',
    });

    loading.present();
  }
}
