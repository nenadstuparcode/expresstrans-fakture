import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceFormComponent } from '@app/modules/invoice/components/invoice-form/invoice-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IonicModule } from '@ionic/angular';
import { MatButtonModule } from '@angular/material/button';
import { InvoiceComponent } from '@app/modules/invoice/invoice.component';
import { HeadlineComponent } from '@app/shared/headline/headline.component';
import { ControlsComponent } from '@app/shared/controls/controls.component';
import { TextPricePipe } from '@app/common/text-price.pipe';
import { PreviewComponent } from '@app/modules/invoice/components/preview/preview.component';
import { MatSelectModule } from '@angular/material/select';
import { DatetimeModalComponent } from '@app/shared/datetime-modal/datetime-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DateComponent } from '@app/shared/date/date.component';
import { TaxPipe } from '@app/common/tax.pipe';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { TableSharedComponent } from '@app/shared/table-shared/table-shared.component';
import { InvoiceListComponent } from '@app/modules/invoice/components/invoice-list/invoice-list.component';
import { ClientPipe } from '@app/common/client.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InvoiceHomeComponent } from '@app/modules/invoice/components/invoice-home/invoice-home.component';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { FilterComponent } from '@app/shared/filter/filter.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InvoiceFormSharedComponent } from '@app/shared/invoice-form-shared/invoice-form-shared.component';
import { InvoiceViewComponent } from '@app/modules/invoice/components/invoice-view/invoice-view.component';
import { DriverPipe } from '@app/common/driver.pipe';
import { InvoiceTypeComponent } from '@app/shared/invoice-type/invoice-type.component';
import { CheckboxComponent } from '@app/shared/checkbox/checkbox.component';
import { RelationsComponent } from '@app/shared/relations/relations.component';

@NgModule({
  declarations: [
    InvoiceFormComponent,
    InvoiceComponent,
    PreviewComponent,
    InvoiceListComponent,
    InvoiceHomeComponent,
    InvoiceViewComponent,
  ],
  imports: [
    CurrencyMaskModule,
    CommonModule,
    InvoiceRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    IonicModule,
    MatButtonModule,
    HeadlineComponent,
    ControlsComponent,
    TextPricePipe,
    DatetimeModalComponent,
    DateComponent,
    MatSelectModule,
    MatDialogModule,
    TaxPipe,
    MatChipsModule,
    MatRadioModule,
    PdfViewerModule,
    TableSharedComponent,
    FilterComponent,
    MatPaginatorModule,
    InvoiceFormSharedComponent,
    InvoiceTypeComponent,
    CheckboxComponent,
    RelationsComponent,
  ],
  providers: [MatDatepickerModule, CurrencyPipe, TaxPipe, DatePipe, ClientPipe, SanitizeHtmlPipe, DriverPipe],
  exports: [
    InvoiceListComponent
  ]
})
export class InvoiceModule {}
