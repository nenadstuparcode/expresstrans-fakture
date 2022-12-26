import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ISearchParams } from '@app/services/clients.service';
import { Subject } from 'rxjs';
import { IFilter } from '@app/modules/invoice/components/invoice-list/invoice-list.component';

@Component({
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  selector: 'table-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<void> = new Subject<void>();
  @Input() params: ISearchParams;
  @Input() filters: IFilter[] = [];
  @Output() onSearch: EventEmitter<ISearchParams> = new EventEmitter<ISearchParams>();
  public searchForm: FormGroup;

  constructor(private fb: FormBuilder) {}
  public ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchTerm: this.fb.control(''),
    });

    this.searchForm.controls['searchTerm'].valueChanges
      .pipe(
        filter((text: string) => text.length >= 2 || text.length === 0),
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

  public filter(filter: { [key: string]: any }): void {
    this.onSearch.emit({
      ...this.params,
      sort: filter.value,
    });
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
