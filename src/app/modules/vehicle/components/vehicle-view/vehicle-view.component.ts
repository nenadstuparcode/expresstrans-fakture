import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { DriversService, IVehicle } from '@app/services/drivers.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ICommonResponse } from '@app/services/clients.service';
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Component({
  selector: 'app-vehicle-view',
  templateUrl: './vehicle-view.component.html',
  styleUrls: ['./vehicle-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleViewComponent implements OnInit {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  public vehicle$: BehaviorSubject<IVehicle> = new BehaviorSubject<IVehicle>(null);
  constructor(private ds: DriversService, private router: Router, private actRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.actRoute.paramMap
      .pipe(
        filter((data: ParamMap) => !!data),
        switchMap((data: ParamMap) => this.ds.getVehicle(data.get('id'))),
        filter((response: ICommonResponse<IVehicle>) => !!response && !this.isEmpty(response.data)),
        tap((response: ICommonResponse<IVehicle>) => {
          this.vehicle$.next(response.data);
        }),
        catchError((err: Error) => {
          this.vehicle$.next(null);

          return throwError(err);
        }),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();
  }

  public isEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  public onAction(action: Action): void {
    switch (action) {
      case Action.cancel: this.router.navigate(['vehicle']);
    }
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
