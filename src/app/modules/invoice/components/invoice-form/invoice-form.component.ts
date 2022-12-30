import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceFormComponent {
  public expanded: boolean = true;
  @Output() public onUpdate: EventEmitter<void> = new EventEmitter<void>();

  constructor(public platform: Platform) {
    this.expanded = !this.platform.is('mobile');
  }

  detectAction(action: Action): void {
    switch (action) {
      case Action.save:
        this.onUpdate.emit();
    }
  }
}
