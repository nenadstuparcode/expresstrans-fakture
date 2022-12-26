import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralDataService } from '@app/services/general-data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  constructor(private gds: GeneralDataService) {}
}
