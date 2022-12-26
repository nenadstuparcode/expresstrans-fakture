import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleFormComponent {
  public expanded: boolean = false;
  @Output() public onUpdate: EventEmitter<void> = new EventEmitter<void>();

  detectAction(action: Action): void {
    switch (action) {
      case Action.save:
        this.onUpdate.emit();
    }
  }
}
