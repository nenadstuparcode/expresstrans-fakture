import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GeneralDataService} from "@app/services/general-data.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public appPages = [
    {
      title: 'Fakture',
      url: '/invoice',
      icon: 'document',
    },
    { title: 'Klijenti', url: '/client', icon: 'people' },
    { title: 'Vozila', url: '/vehicle', icon: 'car' },
    { title: 'Prikolice', url: '/trailer', icon: 'car' },
    { title: 'Vozači', url: '/driver', icon: 'people' },
    { title: 'Relacije', url: '/relation', icon: 'swap-horizontal' },
    { title: 'Izvještaji', url: '/settings', icon: 'settings' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private gds: GeneralDataService) {}

  public ngOnInit(): void {
    this.gds.preloadGeneralData();
  }
}
