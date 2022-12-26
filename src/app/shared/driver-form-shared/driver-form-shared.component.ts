import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, take, tap } from 'rxjs/operators';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { DriversService, IDriver } from '@app/services/drivers.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessageType } from '@app/services/loading.interface';
import { throwError } from 'rxjs';
import { LoadingService } from '@app/services/loading.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, CommonModule, MatFormFieldModule],
  selector: 'app-driver-form-shared',
  templateUrl: './driver-form-shared.component.html',
  styleUrls: ['./driver-form-shared.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverFormSharedComponent {
  public form: FormGroup;
  public sourceData: IDriver;
  @Input() new: boolean = false;
  @Output() onAction: EventEmitter<Action> = new EventEmitter<Action>();
  @Input('data')
  set data(data: IDriver) {
    data ? this.initialize(data) : this.initialize(null);
  }

  constructor(private fb: FormBuilder, private ds: DriversService, private ls: LoadingService) {}

  public initialize(driver: IDriver): void {
    this.sourceData = driver;
    this.form = this.fb.group({
      name: this.fb.control(driver?.name || null, Validators.required),
    });
  }

  public update(): void {
    this.ls
      .start('Ažuriranje vozača')
      .then(() => {
        if (this.form.valid) {
          this.ds
            .updateDriver(this.form.value, this.sourceData._id)
            .pipe(
              tap((data: IDriver) => {
                this.data = data;
                this.onAction.emit(Action.save);
                this.ls.end();
                this.ls.showToast(MessageType.success);
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
      .catch(throwError);
  }

  public create(): void {
    this.ls
      .start('Kreiranje klijenta')
      .then(() => {
        if (this.form.valid) {
          this.ds
            .createDriver(this.form.value)
            .pipe(
              tap(() => {
                this.form.reset();
                this.onAction.emit(Action.save);
                this.ls.end();
                this.ls.showToast(MessageType.success);
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
      .catch(throwError);
  }

  public cancel(): void {
    if (!this.new) {
      this.initialize(this.sourceData);
      this.onAction.emit(Action.cancel);
    } else {
      this.form.reset();
    }
  }
}
