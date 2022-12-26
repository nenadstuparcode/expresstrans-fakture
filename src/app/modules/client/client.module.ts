import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import { ClientComponent } from '@app/modules/client/client.component';
import { IonicModule } from '@ionic/angular';
import { ClientListComponent } from '@app/modules/client/components/client-list/client-list.component';
import { ClientRoutingModule } from '@app/modules/client/client-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ClientFormComponent } from '@app/modules/client/components/client-form/client-form.component';
import { MatSelectModule } from '@angular/material/select';
import { CountryService } from '@app/services/country.service';
import { ClientFormSharedComponent } from '@app/shared/client-form-shared/client-form-shared.component';
import { NotifyService } from '@app/services/notify.service';
import { MatCardModule } from '@angular/material/card';
import { ClientViewComponent } from '@app/modules/client/components/client-view/client-view.component';
import { ClientHomeComponent } from '@app/modules/client/components/client-home/client-home.component';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { TableSharedComponent } from '@app/shared/table-shared/table-shared.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilterComponent } from '@app/shared/filter/filter.component';
import { CountryPipe } from '@app/common/country.pipe';
import { IndicatorComponent } from '@app/shared/indicator/indicator.component';
import { TruncateWithCountPipe } from '@app/common/truncate-pipe';
import {ClientPipe} from "@app/common/client.pipe";
import {DriverPipe} from "@app/common/driver.pipe";
import {InvoiceModule} from "@app/modules/invoice/invoice.module";

@NgModule({
  declarations: [ClientComponent, ClientListComponent, ClientFormComponent, ClientViewComponent, ClientHomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    ClientRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    ClientFormSharedComponent,
    MatCardModule,
    TableSharedComponent,
    MatPaginatorModule,
    FilterComponent,
    IndicatorComponent,
    InvoiceModule,
  ],
  providers: [CountryService, NotifyService, SanitizeHtmlPipe, DatePipe, CountryPipe, ClientPipe, DriverPipe, CurrencyPipe, TruncateWithCountPipe],
  exports: [ClientFormComponent],
})
export class ClientModule {}
