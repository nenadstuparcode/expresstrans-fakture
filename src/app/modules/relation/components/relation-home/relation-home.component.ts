import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NotifyService} from "@app/services/notify.service";
import {Action} from "@app/shared/client-form-shared/client-form-shared.component";

@Component({
  selector: 'app-relation-home',
  templateUrl: './relation-home.component.html',
  styleUrls: ['./relation-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationHomeComponent {
  constructor(private ns: NotifyService) {}

  public updateList(): void {
    this.ns.shouldSave.next(Action.reload);
  }
}
