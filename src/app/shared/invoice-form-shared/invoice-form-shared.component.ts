import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NO_ERRORS_SCHEMA,
  OnDestroy,
  Output,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IExchangeType, TaxService } from '@app/common/tax.service';
import { ClientsService, ICommonResponse, ISearchParams } from '@app/services/clients.service';
import { GeneralDataService } from '@app/services/general-data.service';
import { TaxPipe } from '@app/common/tax.pipe';
import { InvoiceService } from '@app/modules/invoice/invoice.service';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  skip,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { IClient } from '@app/services/clients.interface';
import { IDriver, ITrailer, IVehicle } from '@app/services/drivers.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IAutoCompleteItem, IInvoice, InvoiceType, IRelation, Relation } from '@app/modules/invoice/invoice.interface';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { InvoiceRoutingModule } from '@app/modules/invoice/invoice-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IonicModule } from '@ionic/angular';
import { MatButtonModule } from '@angular/material/button';
import { HeadlineComponent } from '@app/shared/headline/headline.component';
import { ControlsComponent } from '@app/shared/controls/controls.component';
import { TextPricePipe } from '@app/common/text-price.pipe';
import { DatetimeModalComponent } from '@app/shared/datetime-modal/datetime-modal.component';
import { DateComponent } from '@app/shared/date/date.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TableSharedComponent } from '@app/shared/table-shared/table-shared.component';
import { FilterComponent } from '@app/shared/filter/filter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClientPipe } from '@app/common/client.pipe';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { IsInArrayDirective } from '@app/common/autocomplete-validator';
import { NotifyService } from '@app/services/notify.service';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { LoadingService } from '@app/services/loading.service';
import { MessageType } from '@app/services/loading.interface';

@Component({
  standalone: true,
  imports: [
    CurrencyMaskModule,
    CommonModule,
    InvoiceRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    IonicModule,
    MatButtonModule,
    HeadlineComponent,
    ControlsComponent,
    TextPricePipe,
    DatetimeModalComponent,
    DateComponent,
    MatSelectModule,
    MatDialogModule,
    TaxPipe,
    MatChipsModule,
    MatRadioModule,
    PdfViewerModule,
    TableSharedComponent,
    FilterComponent,
    MatPaginatorModule,
    IsInArrayDirective,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [MatDatepickerModule, CurrencyPipe, TaxPipe, DatePipe, ClientPipe, SanitizeHtmlPipe],
  selector: 'app-invoice-form-shared',
  templateUrl: './invoice-form-shared.component.html',
  styleUrls: ['./invoice-form-shared.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceFormSharedComponent implements OnDestroy {
  public componentDestroyed$: Subject<void> = new Subject<void>();
  @Input() loading: boolean = true;
  @Input() new: boolean = null;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  private sourceData: IInvoice | null;
  public updatingCurrenciesEur$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public updatingCurrenciesBam$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public invoiceForm: FormGroup = null;
  public relationsForm: FormGroup = null;
  @Input('data')
  set data(data: any) {
    data ? this.initiateData(data) : this.initiateData(null)
  }

  @Output() public onAction: EventEmitter<Action> = new EventEmitter<Action>();

  clients: IAutoCompleteItem[] = null;
  trailers: IAutoCompleteItem[] = null;
  vehicles: IAutoCompleteItem[] = null;
  drivers: IAutoCompleteItem[] = null;
  relationsList: IAutoCompleteItem[] = null;

  filteredClients$: Observable<IAutoCompleteItem[]>;
  filteredDrivers$: Observable<IAutoCompleteItem[]>;
  filteredVehicles$: Observable<IAutoCompleteItem[]>;
  filteredTrailers$: Observable<IAutoCompleteItem[]>;
  filteredRelations$: Observable<IAutoCompleteItem[]>;

  public date = new FormControl(new Date());
  public serializedDate = new FormControl(new Date().toISOString());

  public constructor(
    private fb: FormBuilder,
    public taxService: TaxService,
    private clientsService: ClientsService,
    private gds: GeneralDataService,
    private taxPipe: TaxPipe,
    private invoiceService: InvoiceService,
    private ns: NotifyService,
    private ls: LoadingService,
  ) {}

  public removeCMR(keyword: string) {
    const index = this.cmr.value.indexOf(keyword);
    if (index >= 0) {
      this.cmr.removeAt(index);
    }
  }

  public addCMR(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.cmr.push(this.fb.control(value));
    }

    event.chipInput!.clear();
  }

  public setUpdating(isUpdating: boolean, type: string): void {
    type === 'bam' ? this.updatingCurrenciesBam$.next(isUpdating) : this.updatingCurrenciesEur$.next(isUpdating);
  }

  public initiateData(data: IInvoice | null): void {
    this.sourceData = data;
    this.loading = true;
    combineLatest([
      this.gds.allClientsList$,
      this.gds.allDriversList$,
      this.gds.allTrailersList$,
      this.gds.allVehiclesList$,
      this.gds.allRelationsList$,
    ])
      .pipe(
        filter(
          ([clients, drivers, trailers, vehicles, relations]: [
            IClient[],
            IDriver[],
            ITrailer[],
            IVehicle[],
            Relation[],
          ]) => !!clients && !!drivers && !!trailers && !!vehicles,
        ),
        tap(
          ([clients, drivers, trailers, vehicles, relations]: [
            IClient[],
            IDriver[],
            ITrailer[],
            IVehicle[],
            Relation[],
          ]) => {
            this.drivers = [
              ...drivers.map((driver: IDriver) => {
                return {
                  id: driver._id,
                  name: driver.name,
                } as IAutoCompleteItem;
              }),
            ];

            this.relationsList = [
              ...relations.map((relation: Relation) => {
                return {
                  id: relation._id,
                  name: relation.name,
                } as IAutoCompleteItem;
              }),
            ];

            this.vehicles = [
              ...vehicles.map((vehicle: IVehicle) => {
                return {
                  id: vehicle._id,
                  name: vehicle.plateNumber,
                } as IAutoCompleteItem;
              }),
            ];

            this.trailers = [
              ...trailers.map((trailer: ITrailer) => {
                return {
                  id: trailer._id,
                  name: trailer.name,
                } as IAutoCompleteItem;
              }),
            ];

            this.clients = [
              ...clients.map((client: IClient) => {
                return {
                  id: client._id,
                  name: client.name,
                } as IAutoCompleteItem;
              }),
            ];

            this.loading = false;
          },
        ),
        filter(() => !!this.drivers && !!this.trailers && !!this.clients && !!this.vehicles),
        tap(() => {
          this.initiateForm(data);

          this.filteredClients$ = this.invoiceForm.controls['clientId'].valueChanges.pipe(
            startWith(''),
            filter((value: any) => !!value && value.length >= 2),
            distinctUntilChanged(),
            debounceTime(300),
            map((value: any) => {
              const name = typeof value === 'string' ? value : value?.name;
              const params: ISearchParams = {
                searchTerm: name,
                searchLimit: 20,
                searchSkip: 0,
                sort: { createdAt: -1},
              };

              return params;
            }),
            switchMap((params: ISearchParams) => {
              return this.clientsService.searchClients(params).pipe(
                map((data: ICommonResponse<IClient[]>) => {
                  return data.data.map((client: IClient) => {
                    return {
                      name: client.name,
                      id: client._id,
                    } as IAutoCompleteItem;
                  });
                }),
              );
            }),
          );

          this.filteredVehicles$ = this.invoiceForm.controls['invoiceVehicle'].valueChanges.pipe(
            startWith(''),
            map((value: string | any) => {
              const name = typeof value === 'string' ? value : value?.name;
              return name ? this._filter(name as string, this.vehicles) : this.vehicles.slice();
            }),
          );

          this.filteredDrivers$ = this.invoiceForm.controls['invDriver'].valueChanges.pipe(
            startWith(''),
            map((value: string | any) => {
              const name = typeof value === 'string' ? value : value?.name;
              return name ? this._filter(name as string, this.drivers) : this.drivers.slice();
            }),
          );

          this.filteredTrailers$ = this.invoiceForm.controls['invTrailer'].valueChanges.pipe(
            startWith(''),
            map((value: string | any) => {
              const name = typeof value === 'string' ? value : value?.name;
              return name ? this._filter(name as string, this.trailers) : this.trailers.slice();
            }),
          );

          this.filteredRelations$ = this.relationsForm.controls['name'].valueChanges.pipe(
            startWith(''),
            map((value: string | any) => {
              const name = typeof value === 'string' ? value : value?.name;
              return name ? this._filter(name as string, this.relationsList) : this.relationsList.slice();
            }),
          );

          this.watchOnCurrencies();
        }),
        take(1),
      )
      .subscribe();
  }

  public watchOnCurrencies(): void {
    this.priceBam.valueChanges
      .pipe(
        skip(1),
        filter(() => !this.updatingCurrenciesEur$.getValue() && this.invoiceType === InvoiceType.cargo),
        tap((data: number) => {
          this.priceEur.setValue(this.taxService.convertCurrency(IExchangeType.bamToEur, data));
          this.tax.setValue(this.taxPipe.transform(data));
        }),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();

    this.priceEur.valueChanges
      .pipe(
        skip(1),
        filter(() => !this.updatingCurrenciesBam$.getValue() && this.invoiceType === InvoiceType.cargo),
        tap((data: number) => {
          this.priceBam.setValue(this.taxService.convertCurrency(IExchangeType.eurToBam, data));
          this.tax.setValue(this.taxPipe.transform(this.priceBam.value));
        }),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();

    this.invoiceForm.controls['priceKm'].valueChanges
      .pipe(
        skip(1),
        filter(() => !this.updatingCurrenciesEur$.getValue() && this.invoiceType === InvoiceType.bus),
        tap((data: number) => {
          this.invoiceForm.controls['priceEuros'].setValue(
            this.taxService.convertCurrency(IExchangeType.bamToEur, data),
          );
          this.invoiceForm.controls['priceKmTax'].setValue(
            this.taxPipe.transform(this.invoiceForm.controls['priceKm'].value),
          );
        }),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();

    this.invoiceForm.controls['priceEuros'].valueChanges
      .pipe(
        skip(1),
        filter(() => !this.updatingCurrenciesBam$.getValue() && this.invoiceType === InvoiceType.bus),
        tap((data: number) => {
          this.invoiceForm.controls['priceKm'].setValue(this.taxService.convertCurrency(IExchangeType.eurToBam, data));
          this.invoiceForm.controls['priceKmTax'].setValue(
            this.taxPipe.transform(this.invoiceForm.controls['priceKm'].value),
          );
        }),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();
  }

  public initiateForm(invoice: IInvoice | null): void {
    this.invoiceForm = this.fb.group({
      invoiceId: this.fb.control(invoice?.invoicePublicId || null),
      clientId: this.fb.control(invoice?.clientId || '', Validators.required),
      invoiceDateStart: this.fb.control<string | null>(invoice?.invoiceDateStart || null, Validators.required),
      invoiceDateReturn: this.fb.control<string | null>(invoice?.invoiceDateReturn || null, Validators.required),
      invoiceRelations: this.fb.array( invoice ? invoice.invoiceRelations.map(r => this.fb.group(r)) : []),
      cmr: this.fb.array(invoice?.cmr || []),
      deadline: this.fb.control(invoice?.deadline || 30, Validators.required),
      priceKm: this.fb.control(invoice?.priceKm || null),
      priceEuros: this.fb.control(invoice?.priceEuros || null),
      priceKmTax: this.fb.control(invoice?.priceKmTax || null),
      accountNumber: this.fb.control(invoice?.accountNumber || null, Validators.required),
      invoiceDrivers: this.fb.array([]),
      invoiceVehicle: this.fb.control(invoice?.invoiceVehicle || ''),
      invoiceTrailer: this.fb.array([]),
      payed: this.fb.control(invoice?.payed || false),
      invoiceType: this.fb.control(invoice?.invoiceType || InvoiceType.cargo, Validators.required),
      invTrailer: this.fb.control(invoice?.invTrailer || null),
      invDriver: this.fb.control(invoice?.invDriver || null),
      active: this.fb.control(invoice ? invoice.active : true),
    });

    this.relationsForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      priceKm: this.fb.control(null),
      priceEur: this.fb.control(null),
      priceKmTax: this.fb.control(null),
      kilometers: this.fb.control(null),
    });
  }

  public get driversArray(): FormArray {
    return this.invoiceForm.controls['invoiceDrivers'] as FormArray;
  }

  public get trailersArray(): FormArray {
    return this.invoiceForm.controls['invoiceTrailer'] as FormArray;
  }

  public get invoiceType(): InvoiceType {
    return this.invoiceForm.controls['invoiceType'].value as InvoiceType;
  }

  public get InvoiceTypes(): typeof InvoiceType {
    return InvoiceType;
  }

  public get cmr(): FormArray {
    return this.invoiceForm.controls['cmr'] as FormArray;
  }

  public get tax(): FormControl {
    return this.relationsForm.controls['priceKmTax'] as FormControl;
  }

  public get invoiceId(): FormControl {
    return this.invoiceForm.controls['invoiceId'] as FormControl;
  }

  public get clientId(): FormControl {
    return this.invoiceForm.controls['clientId'] as FormControl;
  }

  public get relations(): FormArray {
    return this.invoiceForm.controls['invoiceRelations'] as FormArray;
  }

  public addRelation(): void {
    if (this.relationsForm.valid) {
      this.updatingCurrenciesBam$.next(true);
      this.updatingCurrenciesEur$.next(true);
      this.relations.push(this.fb.group(this.relationsForm.value));
      this.relations.markAsDirty();
    }

    this.relationsForm.reset();
    this.updatingCurrenciesBam$.next(false);
    this.updatingCurrenciesEur$.next(false);
  }

  public removeRelation(index: number): void {
    this.relations.removeAt(index);
    this.relations.markAsDirty();
  }

  public get priceBam(): FormControl {
    return this.relationsForm.controls['priceKm'] as FormControl;
  }

  public get priceEur(): FormControl {
    return this.relationsForm.controls['priceEur'] as FormControl;
  }

  public get priceKm(): number {
    return this.invoiceForm.controls['priceKm'].value;
  }

  public displayFn(item: IAutoCompleteItem): string {
    return item && item.name ? item.name : '';
  }

  public displayFnDriver = (id: string): string => {
    if (id) {
      const selectedDriver: IAutoCompleteItem = this.drivers.find((driver: IAutoCompleteItem) => driver.id === id);
      return selectedDriver?.name || '';
    }
  };

  public displayFnTrailer = (id: string): string => {
    if (id) {
      const selectedTrailer: IAutoCompleteItem = this.trailers.find((trailer: IAutoCompleteItem) => trailer.id === id);
      return selectedTrailer?.name || '';
    }
  };

  public displayFnRelation = (id: string): string => {
    if (id) {
      const selectedRelation: IAutoCompleteItem = this.relationsList.find((r: IAutoCompleteItem) => r.id === id);
      return selectedRelation?.name || '';
    }
  };

  public displayFnVehicle = (id: string): string => {
    if (id) {
      const selectedVehicle: IAutoCompleteItem = this.vehicles.find((vehicle: IAutoCompleteItem) => vehicle.id === id);
      return selectedVehicle?.name || '';
    }
  };

  public displayFnClient = (id: string): string => {
    if (id) {
      const selectedClient: IAutoCompleteItem = this.clients.find((client: IAutoCompleteItem) => client.id === id);
      return selectedClient?.name || '';
    }
  };

  private _filter(name: string, array: any[]): IAutoCompleteItem[] {
    const filterValue = name.toLowerCase();

    return array.filter((option) => option.name.toLowerCase().includes(filterValue));
  }

  public setDate(date: string, control: AbstractControl): void {
    control.setValue(date);
  }

  public setTime(time: string, control: FormControl): void {
    control.setValue(time);
  }

  public get invDriver(): FormControl {
    return this.invoiceForm.controls['invDriver'] as FormControl;
  }

  public get invTrailer(): FormControl {
    return this.invoiceForm.controls['invTrailer'] as FormControl;
  }

  public calculateTotalPrices(): void {
    if (this.invoiceType === InvoiceType.cargo) {
      let totalKM = 0;
      let totalEur = 0;
      let totalKmTax = 0;

      this.relations.value.map((r) => {
        totalKM += r.priceKm;
        totalEur += r.priceEur;
        totalKmTax += r.priceKmTax;
      });

      this.invoiceForm.controls['priceKm'].setValue(totalKM);
      this.invoiceForm.controls['priceEuros'].setValue(totalEur);
      this.invoiceForm.controls['priceKmTax'].setValue(totalKmTax);
    }
  }

  public resetAll(): void {
    this.invoiceForm.reset();
    this.relationsForm.reset();
  }

  public createInvoice(): void {
    this.ls
      .start('Kreiranje Fakture')
      .then(() => {
        if (this.invDriver.value) {
          this.driversArray.reset();
          this.driversArray.push(this.fb.control(this.drivers.find((d) => d.id === this.invDriver.value).name));
        }

        if (this.invTrailer.value) {
          this.trailersArray.reset();
          this.trailersArray.push(this.fb.control(this.trailers.find((t) => t.id === this.invTrailer.value).name));
        }

        this.calculateTotalPrices();

        this.invoiceService
          .createInvoice(this.invoiceForm.value)
          .pipe(
            tap(() => {
              this.ls.end();
              this.resetAll();
              this.ls.showToast(MessageType.success);
              this.ns.shouldSave.next(Action.reload);
            }),
            catchError((err: Error) => {
              this.ls.end();
              this.ls.showToast(MessageType.err);
              return throwError(err);
            }),
            take(1),
          )
          .subscribe();
      })
      .catch((err: Error) => {
        this.ls.end();
        return throwError(err);
      });
  }

  public updateInvoice(): void {
    this.ls
      .start('Ažuriranje Fakture')
      .then(() => {
        if (this.invDriver.value) {
          this.clearFormArray(this.driversArray);
          this.driversArray.push(this.fb.control(this.drivers.find((d) => d.id === this.invDriver.value).name));
        }

        if (this.invTrailer.value) {
          this.clearFormArray(this.trailersArray);
          this.trailersArray.push(this.fb.control(this.trailers.find((t) => t.id === this.invTrailer.value).name));
        }

        this.calculateTotalPrices();

        if (this.invoiceForm.valid) {
          this.invoiceService
            .updateInvoice(this.invoiceForm.value, this.sourceData._id)
            .pipe(
              tap((response: IInvoice) => {
                this.ls.showToast(MessageType.success);
                this.ls.end();
                this.ns.shouldSave.next(Action.reload);
                this.invoiceForm.reset();
                this.initiateForm(response);
              }),
              catchError((err: Error) => {
                this.ls.end();
                this.ls.showToast(MessageType.err);
                return throwError(err);
              }),
              take(1),
            )
            .subscribe();
        }
      })
      .catch((err: Error) => {
        this.ls.end();
        this.ls.showToast(MessageType.err);
        return throwError(err);
      });
  }

  public calculateRelations(relations: IRelation[], prop: string): number {
    let total: number = 0;
    relations.map((relation: IRelation) => (total += relation[prop]));
    return total;
  }

  public calculateKilometers(relations: IRelation[]): number {
    let total: number = 0;
    relations.map((relations: IRelation) => (total += relations.kilometers));
    return total;
  }

  public resetFullPrice(): void {
    this.updatingCurrenciesBam$.next(true);
    this.updatingCurrenciesEur$.next(true);
    this.invoiceForm.controls['priceEuros'].reset();
    this.invoiceForm.controls['priceKm'].reset();
    this.invoiceForm.controls['priceKmTax'].reset();
    this.invoiceForm.controls['invTrailer'].reset();
    this.updatingCurrenciesBam$.next(false);
    this.updatingCurrenciesEur$.next(false);
  }

  public resetCargoRelations(): void {
    this.updatingCurrenciesBam$.next(true);
    this.updatingCurrenciesEur$.next(true);
    this.relationsForm.reset();
    while (this.relations.length !== 0) {
      this.relations.removeAt(0);
    }

    this.invoiceForm.controls['invTrailer'].reset();
    this.updatingCurrenciesBam$.next(false);
    this.updatingCurrenciesEur$.next(false);
  }

  public resetForm(control: AbstractControl, event: any): void {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    control.reset();
  }

  public onCancel(): void {
    if (!this.new) {
      this.initiateForm(this.sourceData);
      this.onAction.emit(Action.cancel);
    } else {
      this.updatingCurrenciesBam$.next(true);
      this.updatingCurrenciesEur$.next(true);
      this.initiateData(null);
      this.updatingCurrenciesBam$.next(false);
      this.updatingCurrenciesEur$.next(false);
    }
  }

  public clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  };

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
