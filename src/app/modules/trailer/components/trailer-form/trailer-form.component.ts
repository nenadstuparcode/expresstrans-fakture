import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';

@Component({
  selector: 'app-trailer-form',
  templateUrl: './trailer-form.component.html',
  styleUrls: ['./trailer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailerFormComponent {
  public expanded: boolean = false;
  @Output() public onUpdate: EventEmitter<void> = new EventEmitter<void>();

  detectAction(action: Action): void {
    switch (action) {
      case Action.save:
        this.onUpdate.emit();
    }
  }
}
