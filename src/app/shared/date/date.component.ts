import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DatetimeModalComponent } from '@app/shared/datetime-modal/datetime-modal.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {AbstractControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  providers: [MatDatepickerModule],
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateComponent implements OnDestroy {
  public componentDestroyed$: Subject<void> = new Subject<void>();
  @Input() public name: string | null = null;
  @Input() public group: FormGroup;
  @Input() public title: string | null = null;
  @Input() public type: 'time' | 'date' = 'date';
  @Output() public onChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(public dialog: MatDialog) {}

  public openDateModal(type: 'date' | 'time'): void {
    const dialogRef: MatDialogRef<DatetimeModalComponent> = this.dialog.open(DatetimeModalComponent, {
      height: '400px',
      width: '400px',
      data: type,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((result: any) => {
        if (result) {
          this.setDate(result);
        }
      });
  }

  public setDate(date: string): void {
    this.onChange.emit(date);
  }

  public ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
