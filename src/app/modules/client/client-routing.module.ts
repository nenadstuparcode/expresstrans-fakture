import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ClientComponent } from '@app/modules/client/client.component';
import { ClientListComponent } from '@app/modules/client/components/client-list/client-list.component';
import {ClientHomeComponent} from "@app/modules/client/components/client-home/client-home.component";
import {ClientViewComponent} from "@app/modules/client/components/client-view/client-view.component";

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        pathMatch: 'full',
        component: ClientHomeComponent,
      },
      {
        path: 'view/:id',
        component: ClientViewComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
