import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrailerComponent } from '@app/modules/trailer/trailer.component';
import {TrailerHomeComponent} from "@app/modules/trailer/components/trailer-home/trailer-home.component";
import {TrailerViewComponent} from "@app/modules/trailer/components/trailer-view/trailer-view.component";

const routes: Routes = [
  {
    path: '',
    component: TrailerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: TrailerHomeComponent,
      },
      {
        path: 'view/:id',
        component: TrailerViewComponent,
      }
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrailerRoutingModule {}
