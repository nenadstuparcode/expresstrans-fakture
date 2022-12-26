import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TrailerComponent } from '@app/modules/trailer/trailer.component';
import { TrailerRoutingModule } from '@app/modules/trailer/trailer-routing.module';
import { TrailerFormComponent } from '@app/modules/trailer/components/trailer-form/trailer-form.component';
import { TrailerListComponent } from '@app/modules/trailer/components/trailer-list/trailer-list.component';
import { TrailerFormSharedComponent } from '@app/shared/trailer-form-shared/trailer-form-shared.component';
import { TrailerHomeComponent } from '@app/modules/trailer/components/trailer-home/trailer-home.component';
import { TrailerViewComponent } from '@app/modules/trailer/components/trailer-view/trailer-view.component';
import { SanitizeHtmlPipe } from '@app/common/sanitize.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilterComponent } from '@app/shared/filter/filter.component';
import { TableSharedComponent } from '@app/shared/table-shared/table-shared.component';

@NgModule({
  declarations: [
    TrailerComponent,
    TrailerFormComponent,
    TrailerListComponent,
    TrailerHomeComponent,
    TrailerViewComponent,
  ],
  imports: [
    CommonModule,
    TrailerRoutingModule,
    TrailerFormSharedComponent,
    MatPaginatorModule,
    FilterComponent,
    TableSharedComponent,
  ],
  providers: [SanitizeHtmlPipe, DatePipe],
})
export class TrailerModule {}
