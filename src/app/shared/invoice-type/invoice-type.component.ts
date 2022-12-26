import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCellComponent } from '@app/shared/base-cell/base-table-cell';
import { InvoiceType } from '@app/modules/invoice/invoice.interface';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-invoice-type',
  templateUrl: './invoice-type.component.html',
  styleUrls: ['./invoice-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceTypeComponent extends BaseCellComponent {
  constructor() {
    super();
  }
  public get invoiceType(): typeof InvoiceType {
    return InvoiceType;
  }
}
