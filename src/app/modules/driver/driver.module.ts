import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DriverComponent } from '@app/modules/driver/driver.component';
import { DriverRoutingModule } from '@app/modules/driver/driver-routing.module';
import { IonicModule } from '@ionic/angular';
import { DriverFormSharedComponent } from '@app/shared/driver-form-shared/driver-form-shared.component';
import { DriverFormComponent } from '@app/modules/driver/components/driver-form/driver-form.component';
import { DriverListComponent } from '@app/modules/driver/components/driver-list/driver-list.component';
import { TableSharedComponent } from '@app/shared/table-shared/table-shared.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilterComponent } from '@app/shared/filter/filter.component';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { DateFormatComponent } from '@app/shared/date-format/date-format.component';
import { DriverViewComponent } from '@app/modules/driver/components/driver-view/driver-view.component';
import { DriverHomeComponent } from '@app/modules/driver/components/driver-home/driver-home.component';

@NgModule({
  declarations: [
    DriverComponent,
    DriverFormComponent,
    DriverHomeComponent,
    DriverListComponent,
    DriverViewComponent,
  ],
  imports: [
    CommonModule,
    DriverRoutingModule,
    IonicModule,
    DriverFormSharedComponent,
    TableSharedComponent,
    MatPaginatorModule,
    FilterComponent,
    DateFormatComponent,
  ],
  providers: [DatePipe, SanitizeHtmlPipe],
})
export class DriverModule {}
