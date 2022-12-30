import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DriversService, ITrailer } from '@app/services/drivers.service';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { catchError, take, tap } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessageType } from '@app/services/loading.interface';
import { throwError } from 'rxjs';
import { LoadingService } from '@app/services/loading.service';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, CommonModule, MatFormFieldModule, IonicModule],
  selector: 'app-trailer-form-shared',
  templateUrl: './trailer-form-shared.component.html',
  styleUrls: ['./trailer-form-shared.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailerFormSharedComponent {
  public form: FormGroup;
  public sourceData: ITrailer;
  @Input() new: boolean = false;
  @Output() onAction: EventEmitter<Action> = new EventEmitter<Action>();
  @Input('data')
  set data(data: ITrailer) {
    data ? this.initialize(data) : this.initialize(null);
  }

  constructor(private fb: FormBuilder, private ls: LoadingService, private ds: DriversService) {}

  public initialize(trailer: ITrailer): void {
    this.sourceData = trailer;
    this.form = this.fb.group({
      name: this.fb.control(trailer?.name || null, Validators.required),
    });
  }

  public update(): void {
    this.ls
      .start('Ažuriranje prikolioce')
      .then(() => {
        if (this.form.valid) {
          this.ds
            .updateTrailer(this.form.value, this.sourceData._id)
            .pipe(
              tap((data: ITrailer) => {
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
      .start('Kreiranje prikoloce')
      .then(() => {
        if (this.form.valid) {
          this.ds
            .createTrailer(this.form.value)
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
