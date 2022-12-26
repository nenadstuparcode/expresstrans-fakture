import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ClientsService} from '@app/services/clients.service';
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientFormComponent {
  @Output() public onUpdate: EventEmitter<void> = new EventEmitter<void>();
  public expanded: boolean = false;

  detectAction(action: Action): void {
    switch (action) {
      case Action.save: this.onUpdate.emit();
    }
  }
}
