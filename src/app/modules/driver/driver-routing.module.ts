import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverComponent } from '@app/modules/driver/driver.component';
import {DriverViewComponent} from "@app/modules/driver/components/driver-view/driver-view.component";
import {DriverHomeComponent} from "@app/modules/driver/components/driver-home/driver-home.component";

const routes: Routes = [
  {
    path: '',
    component: DriverComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        pathMatch:'full',
        component: DriverHomeComponent,
      },
      {
        path:'view/:id',
        component: DriverViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverRoutingModule {}
