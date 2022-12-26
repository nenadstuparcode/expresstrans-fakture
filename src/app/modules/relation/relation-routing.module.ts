import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RelationComponent } from '@app/modules/relation/relation.component';
import { RelationHomeComponent } from '@app/modules/relation/components/relation-home/relation-home.component';
import { RelationViewComponent } from '@app/modules/relation/components/relation-view/relation-view.component';

const routes: Routes = [
  {
    path: '',
    component: RelationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        pathMatch: 'full',
        component: RelationHomeComponent,
      },
      {
        path: 'view/:id',
        component: RelationViewComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelationRoutingModule {}
