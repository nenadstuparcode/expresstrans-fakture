import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleComponent } from '@app/modules/vehicle/vehicle.component';
import { VehicleHomeComponent } from '@app/modules/vehicle/components/vehicle-home/vehicle-home.component';
import { VehicleViewComponent } from '@app/modules/vehicle/components/vehicle-view/vehicle-view.component';

const routes: Routes = [
  {
    path: '',
    component: VehicleComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: VehicleHomeComponent,
      },
      {
        path: 'view/:id',
        component: VehicleViewComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleRoutingModule {}
