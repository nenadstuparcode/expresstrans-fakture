import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NotifyService } from '@app/services/notify.service';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-trailer',
  templateUrl: './trailer.component.html',
  styleUrls: ['./trailer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrailerComponent {
  constructor(private ns: NotifyService, private location: Location) {}

  public goBack(): void {
    this.location.back();
  }

  public updateList(): void {
    this.ns.shouldSave.next(Action.reload);
  }
}
