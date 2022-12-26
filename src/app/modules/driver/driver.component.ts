import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotifyService } from '@app/services/notify.service';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverComponent {
  constructor(private ns: NotifyService) {}

  public updateList(): void {
    this.ns.shouldSave.next(Action.reload);
  }
}
