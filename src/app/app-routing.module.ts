import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'invoice',
    pathMatch: 'full'
  },
  {
    path: 'invoice',
    loadChildren: () => import('./modules/invoice/invoice.module').then( m => m.InvoiceModule)
  },
  {
    path: 'client',
    loadChildren: () => import('./modules/client/client.module').then( m => m.ClientModule)
  },
  {
    path: 'driver',
    loadChildren: () => import('./modules/driver/driver.module').then( m => m.DriverModule)
  },
  {
    path: 'vehicle',
    loadChildren: () => import('./modules/vehicle/vehicle.module').then( m => m.VehicleModule)
  },
  {
    path: 'trailer',
    loadChildren: () => import('./modules/trailer/trailer.module').then( m => m.TrailerModule)
  },
  {
    path: 'relation',
    loadChildren: () => import('./modules/relation/relation.module').then( m => m.RelationModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then( m => m.SettingsModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
