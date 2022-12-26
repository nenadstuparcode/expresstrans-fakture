import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { RelationComponent } from '@app/modules/relation/relation.component';
import { RelationHomeComponent } from '@app/modules/relation/components/relation-home/relation-home.component';
import { RelationViewComponent } from '@app/modules/relation/components/relation-view/relation-view.component';
import { RelationListComponent } from '@app/modules/relation/components/relation-list/relation-list.component';
import {IonicModule} from "@ionic/angular";
import {FilterComponent} from "@app/shared/filter/filter.component";
import {TableSharedComponent} from "@app/shared/table-shared/table-shared.component";
import {RelationRoutingModule} from "@app/modules/relation/relation-routing.module";
import {SanitizeHtmlPipe} from "@app/common/sanitize.pipe";
import {MatPaginatorModule} from "@angular/material/paginator";
import {RelationFormComponent} from "@app/modules/relation/components/relation-form/relation-form.component";
import {RelationFormSharedComponent} from "@app/shared/relation-form-shared/relation-form-shared.component";

@NgModule({
  declarations: [RelationComponent, RelationHomeComponent, RelationViewComponent, RelationListComponent, RelationFormComponent],
  imports: [CommonModule, IonicModule, FilterComponent, TableSharedComponent, RelationRoutingModule, MatPaginatorModule, RelationFormSharedComponent],
  exports: [],
  providers: [SanitizeHtmlPipe, DatePipe],
})
export class RelationModule {}
