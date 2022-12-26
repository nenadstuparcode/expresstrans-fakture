import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NotifyService} from '@app/services/notify.service';
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleComponent {
  constructor(private ns: NotifyService) {}

  public updateList(): void {
    this.ns.shouldSave.next(Action.reload);
  }
}
