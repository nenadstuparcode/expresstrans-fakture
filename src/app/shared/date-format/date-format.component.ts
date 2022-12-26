import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTableCellComponent } from '@app/shared/base-cell/base-table-cell';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'date-format',
  templateUrl: './date-format.component.html',
  styleUrls: ['./date-format.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFormatComponent extends BaseTableCellComponent {}
