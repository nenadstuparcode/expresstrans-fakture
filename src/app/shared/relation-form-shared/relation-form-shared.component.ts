import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { catchError, take, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Relation } from '@app/modules/invoice/invoice.interface';
import { RelationsService } from '@app/services/relations.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessageType } from '@app/services/loading.interface';
import { throwError } from 'rxjs';
import { LoadingService } from '@app/services/loading.service';
import {IonicModule} from "@ionic/angular";

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, CommonModule, MatFormFieldModule, IonicModule],
  providers: [RelationsService],
  selector: 'app-relation-form-shared',
  templateUrl: './relation-form-shared.component.html',
  styleUrls: ['./relation-form-shared.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationFormSharedComponent {
  public form: FormGroup;
  public sourceData: Relation;
  @Input() new: boolean = false;
  @Output() onAction: EventEmitter<Action> = new EventEmitter<Action>();
  @Input('data')
  set data(data: Relation) {
    data ? this.initialize(data) : this.initialize(null);
  }

  constructor(private fb: FormBuilder, private ls: LoadingService, private ds: RelationsService) {}

  public initialize(relation: Relation): void {
    this.sourceData = relation;
    this.form = this.fb.group({
      name: this.fb.control(relation?.name || null, Validators.required),
    });
  }

  public update(): void {
    this.ls
      .start('Ažuriranje relacije')
      .then(() => {
        if (this.form.valid) {
          this.ds
            .updateRelation(this.form.value, this.sourceData._id)
            .pipe(
              tap((data: Relation) => {
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
      .start('Kreiranje relacije')
      .then(() => {
        if (this.form.valid) {
          this.ds
            .createRelation(this.form.value)
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
