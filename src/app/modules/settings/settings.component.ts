import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralDataService } from '@app/services/general-data.service';
import {NotifyService} from "@app/services/notify.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  constructor(public gds: GeneralDataService, private location: Location) {}

  public goBack(): void {
    this.location.back();
  }
}
