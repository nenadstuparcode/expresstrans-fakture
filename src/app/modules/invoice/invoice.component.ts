import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GeneralDataService } from '@app/services/general-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceComponent {
  constructor(public gds: GeneralDataService, private location: Location) {}

  public goBack(): void {
    this.location.back();
  }
}
