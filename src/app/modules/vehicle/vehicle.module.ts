import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VehicleComponent } from '@app/modules/vehicle/vehicle.component';
import { VehicleRoutingModule } from '@app/modules/vehicle/vehicle-routing.module';
import { VehicleFormComponent } from '@app/modules/vehicle/components/vehicle-form/vehicle-form.component';
import { VehicleListComponent } from '@app/modules/vehicle/components/vehicle-list/vehicle-list.component';
import { IonicModule } from '@ionic/angular';
import { VehicleFormSharedComponent } from '@app/shared/vehicle-form-shared/vehicle-form-shared.component';
import { VehicleHomeComponent } from '@app/modules/vehicle/components/vehicle-home/vehicle-home.component';
import { VehicleViewComponent } from '@app/modules/vehicle/components/vehicle-view/vehicle-view.component';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { TableSharedComponent } from '@app/shared/table-shared/table-shared.component';
import { FilterComponent } from '@app/shared/filter/filter.component';
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    VehicleComponent,
    VehicleFormComponent,
    VehicleListComponent,
    VehicleHomeComponent,
    VehicleViewComponent,
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    IonicModule,
    VehicleFormSharedComponent,
    TableSharedComponent,
    FilterComponent,
    MatPaginatorModule,
  ],
  providers: [SanitizeHtmlPipe, DatePipe],
})
export class VehicleModule {}
