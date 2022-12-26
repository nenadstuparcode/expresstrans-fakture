import { ChangeDetectionStrategy, Component, Input, Renderer2 } from '@angular/core';
import { BaseTableCellComponent } from '@app/shared/base-cell/base-table-cell';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-base-cell',
  templateUrl: './base-cell.component.html',
  styleUrls: ['./base-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellComponent extends BaseTableCellComponent {
  constructor(public renderer: Renderer2) {
    super();
  }
}
