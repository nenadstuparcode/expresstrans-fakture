import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';

@Component({
  selector: 'app-driver-form',
  templateUrl: './driver-form.component.html',
  styleUrls: ['./driver-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverFormComponent {
  public expanded: boolean = false;
  @Output() public onUpdate: EventEmitter<void> = new EventEmitter<void>();

  detectAction(action: Action): void {
    switch (action) {
      case Action.save:
        this.onUpdate.emit();
    }
  }
}
