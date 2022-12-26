import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-invoice-home',
  templateUrl: './invoice-home.component.html',
  styleUrls: ['./invoice-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceHomeComponent {}
