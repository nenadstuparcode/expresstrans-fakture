import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {DriversService, ITrailer} from '@app/services/drivers.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {catchError, filter, switchMap, takeUntil, tap} from 'rxjs/operators';
import {ICommonResponse} from '@app/services/clients.service';
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Component({
  selector: 'app-trailer-view',
  templateUrl: './trailer-view.component.html',
  styleUrls: ['./trailer-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailerViewComponent implements OnInit {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  public trailer$: BehaviorSubject<ITrailer> = new BehaviorSubject<ITrailer>(null);
  constructor(private ds: DriversService, private router: Router, private actRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.actRoute.paramMap
      .pipe(
        filter((data: ParamMap) => !!data),
        switchMap((data: ParamMap) => this.ds.getTrailer(data.get('id'))),
        filter((response: ICommonResponse<ITrailer>) => !!response && !this.isEmpty(response.data)),
        tap((response: ICommonResponse<ITrailer>) => {
          console.log(response);
          this.trailer$.next(response.data);
        }),
        catchError((err: Error) => {
          this.trailer$.next(null);

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
      case Action.cancel: this.router.navigate(['trailer']);
    }
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
