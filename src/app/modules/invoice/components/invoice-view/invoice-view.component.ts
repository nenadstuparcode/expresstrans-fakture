import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { IInvoice } from '@app/modules/invoice/invoice.interface';
import { InvoiceService } from '@app/modules/invoice/invoice.service';
import {GeneralDataService} from "@app/services/general-data.service";
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceViewComponent implements OnInit {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  public invoice$: BehaviorSubject<IInvoice> = new BehaviorSubject<IInvoice>(null);
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor(
    private ds: InvoiceService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private gds: GeneralDataService,
    ) {}

  public ngOnInit(): void {
    this.actRoute.paramMap
      .pipe(
        filter((data: ParamMap) => !!data),
        switchMap((data: ParamMap) => this.ds.getInvoice(data.get('id'))),
        filter((response: IInvoice) => !!response && !this.isEmpty(response)),
        tap((response: IInvoice) => {
          this.invoice$.next(response);
          this.loading$.next(false);
        }),
        catchError((err: Error) => {
          this.invoice$.next(null);
          this.loading$.next(false);

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
      case Action.cancel: this.router.navigate(['invoice']);
    }
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
