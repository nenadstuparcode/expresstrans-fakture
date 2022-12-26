import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ICommonResponse } from '@app/services/clients.service';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { Relation } from '@app/modules/invoice/invoice.interface';
import { RelationsService } from '@app/services/relations.service';

@Component({
  selector: 'app-relation-view',
  templateUrl: './relation-view.component.html',
  styleUrls: ['./relation-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationViewComponent implements OnInit {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  public relation$: BehaviorSubject<Relation> = new BehaviorSubject<Relation>(null);
  constructor(private ds: RelationsService, private router: Router, private actRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.actRoute.paramMap
      .pipe(
        filter((data: ParamMap) => !!data),
        switchMap((data: ParamMap) => this.ds.getRelation(data.get('id'))),
        filter((response: ICommonResponse<Relation>) => !!response && !this.isEmpty(response.data)),
        tap((response: ICommonResponse<Relation>) => {
          this.relation$.next(response.data);
        }),
        catchError((err: Error) => {
          this.relation$.next(null);

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
      case Action.cancel:
        this.router.navigate(['relation']);
    }
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
