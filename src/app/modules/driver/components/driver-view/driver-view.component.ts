import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { DriversService, IDriver } from '@app/services/drivers.service';
import { ICommonResponse } from '@app/services/clients.service';
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Component({
  selector: 'app-driver-view',
  templateUrl: './driver-view.component.html',
  styleUrls: ['./driver-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverViewComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  public driver$: BehaviorSubject<IDriver> = new BehaviorSubject<IDriver>(null);
  constructor(private ds: DriversService, private router: Router, private actRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.actRoute.paramMap
      .pipe(
        filter((data: ParamMap) => !!data),
        switchMap((data: ParamMap) => this.ds.getDriver(data.get('id'))),
        filter((response: ICommonResponse<IDriver>) => !!response && !this.isEmpty(response.data)),
        tap((response: ICommonResponse<IDriver>) => {
          this.driver$.next(response.data);
        }),
        catchError((err: Error) => {
          this.driver$.next(null);

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
      case Action.cancel: this.router.navigate(['driver']);
    }
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
