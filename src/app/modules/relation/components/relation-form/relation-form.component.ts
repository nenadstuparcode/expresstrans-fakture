import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Component({
  selector: 'app-relation-form',
  templateUrl: './relation-form.component.html',
  styleUrls: ['./relation-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationFormComponent {
  public expanded: boolean = false;
  @Output() public onUpdate: EventEmitter<void> = new EventEmitter<void>();

  detectAction(action: Action): void {
    switch (action) {
      case Action.save:
        this.onUpdate.emit();
    }
  }
}
