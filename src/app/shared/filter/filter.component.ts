import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ISearchParams } from '@app/services/clients.service';
import {BehaviorSubject, Subject} from 'rxjs';
import { IFilter } from '@app/modules/invoice/components/invoice-list/invoice-list.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { DateComponent } from '@app/shared/date/date.component';
import {IonicModule} from "@ionic/angular";

@Component({
  standalone: true,
  imports: [
    DateComponent,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    IonicModule,
  ],
  selector: 'table-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  @Input() params: ISearchParams;
  @Input() sortOptions: IFilter[] = null;
  @Input() dateRange: boolean = false;
  @Output() onSearch: EventEmitter<ISearchParams> = new EventEmitter<ISearchParams>();
  public searchForm: FormGroup;
  public range: FormGroup;
  public start: FormControl = new FormControl('');
  public end: FormControl = new FormControl('');
  public resetingValues: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private fb: FormBuilder) {}
  public ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchTerm: this.fb.control(''),
    });

    this.start.valueChanges
      .pipe(
        filter((data: any) => !!data && this.resetingValues.getValue() === false),
        distinctUntilChanged(),
        tap((data: any) => {
          console.log(data);
          this.params = {
            ...this.params,
            searchSkip: 0,
            start: this.start.value,
          };
          this.search(this.params);
        }),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();

    this.end.valueChanges
      .pipe(
        filter((data: any) => !!data && this.resetingValues.getValue() === false),
        distinctUntilChanged(),
        tap((data: any) => {
          console.log(data);
          this.params = {
            ...this.params,
            searchSkip: 0,
            end: this.end.value,
          };
          this.search(this.params);
        }),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();

    this.searchForm.controls['searchTerm'].valueChanges
      .pipe(
        filter((text: string) => !!text && this.resetingValues.getValue() === false),
        tap((text: string) => {
          this.params = {
            ...this.params,
            searchTerm: text,
            searchSkip: 0,
          };
        }),
        distinctUntilChanged(),
        debounceTime(700),
        tap((text: string) => this.search(this.params)),
        takeUntil(this.componentDestroyed$),
      )
      .subscribe();
  }

  public search(params: ISearchParams): void {
    this.onSearch.emit(params);
  }

  public sort(sort: { [key: string]: any }): void {
    this.onSearch.emit({
      ...this.params,
      sort: sort.value,
    });
  }

  public resetDates(): void {
    this.resetingValues.next(true);
    this.start.reset();
    this.end.reset();
    this.searchForm.reset();
    this.params = {
      ...this.params,
      start: null,
      end: null,
      searchTerm: '',
      sort: null,
    }
    this.search(this.params);
    this.resetingValues.next(false);
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
