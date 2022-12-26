import { Component } from '@angular/core';
import { NotifyService } from '@app/services/notify.service';
import { Action } from '@app/shared/client-form-shared/client-form-shared.component';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.scss'],
})
export class ClientHomeComponent {
  constructor(private ns: NotifyService) {}

  public updateList(): void {
    this.ns.shouldSave.next(Action.reload);
  }
}
