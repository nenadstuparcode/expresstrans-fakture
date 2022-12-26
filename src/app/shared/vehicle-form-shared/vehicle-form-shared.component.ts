import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DriversService, IDriver, IVehicle} from '@app/services/drivers.service';
import {Action} from '@app/shared/client-form-shared/client-form-shared.component';
import {catchError, take, tap} from 'rxjs/operators';
import {ICommonResponse} from '@app/services/clients.service';
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MessageType} from "@app/services/loading.interface";
import {throwError} from "rxjs";
import {LoadingService} from "@app/services/loading.service";

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, CommonModule],
  selector: 'app-vehicle-form-shared',
  templateUrl: './vehicle-form-shared.component.html',
  styleUrls: ['./vehicle-form-shared.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleFormSharedComponent {
  public form: FormGroup;
  public sourceData: IVehicle;
  @Input() new: boolean = false;
  @Output() onAction: EventEmitter<Action> = new EventEmitter<Action>();
  @Input('data')
  set data(data: IVehicle) {
    data ? this.initialize(data): this.initialize(null);
  }

  constructor(private fb: FormBuilder, private ls: LoadingService, private ds: DriversService) {}

  public initialize(vehicle: IVehicle): void {
    this.sourceData = vehicle;
    this.form = this.fb.group({
      plateNumber: this.fb.control(vehicle?.plateNumber || null, Validators.required),
    });
  }

  public update(): void {
    this.ls
      .start('Ažuriranje vozila')
      .then(() => {
        if (this.form.valid) {
          this.ds
            .updateVehicle(this.form.value, this.sourceData._id)
            .pipe(
              tap((data: IVehicle) => {
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
      .start('Kreiranje vozila')
      .then(() => {
        if (this.form.valid) {
          this.ds
            .createVehicle(this.form.value)
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
