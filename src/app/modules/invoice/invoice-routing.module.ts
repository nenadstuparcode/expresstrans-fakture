import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { InvoiceComponent } from '@app/modules/invoice/invoice.component';
import { InvoiceHomeComponent } from '@app/modules/invoice/components/invoice-home/invoice-home.component';
import { InvoiceViewComponent } from '@app/modules/invoice/components/invoice-view/invoice-view.component';

const routes: Routes = [
  {
    path: '',
    component: InvoiceComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        pathMatch: 'full',
        component: InvoiceHomeComponent,
      },
      {
        path: 'view/:id',
        component: InvoiceViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceRoutingModule {}
