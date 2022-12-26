import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IClient } from '@app/services/clients.interface';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CountryService } from '@app/services/country.service';
import { catchError, take, tap } from 'rxjs/operators';
import { ClientsService } from '@app/services/clients.service';
import { LoadingService } from '@app/services/loading.service';
import { throwError } from 'rxjs';
import { MessageType } from '@app/services/loading.interface';

export enum Action {
  save = 'save',
  cancel = 'cancel',
  delete = 'delete',
  reload = 'reload',
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatIconModule, MatSelectModule, MatFormFieldModule],
  providers: [],
  selector: 'app-client-form-shared',
  templateUrl: './client-form-shared.component.html',
  styleUrls: ['./client-form-shared.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormSharedComponent {
  public form: FormGroup;
  private sourceData: IClient;
  @Input() new: boolean = false;
  @Output() onAction: EventEmitter<Action> = new EventEmitter<Action>();
  @Input('data')
  set data(data: IClient) {
    data ? this.initialize(data) : this.initialize(null);
  }

  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private countryService: CountryService,
    private cs: ClientsService,
  ) {}

  public initialize(client: IClient): void {
    this.sourceData = client;
    this.form = this.fb.group({
      name: this.fb.control(client?.name || null, Validators.required),
      info: this.fb.control(client?.info || null),
      address: this.fb.control(client?.address || null, Validators.required),
      zip: this.fb.control(client?.zip || null),
      city: this.fb.control(client?.city || null, Validators.required),
      country: this.fb.control(client?.country || null, Validators.required),
      pib: this.fb.control(client?.pib || null, Validators.required),
      phone: this.fb.control(client?.phone || null),
      contact: this.fb.control(client?.contact || null),
    });
  }

  public update(): void {
    this.ls
      .start('Ažuriranje klijenta')
      .then(() => {
        if (this.form.valid) {
          this.cs
            .updateClient(this.form.value, this.sourceData._id)
            .pipe(
              tap((client: IClient) => {
                this.data = client;
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
          this.cs
            .saveClient(this.form.value)
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
