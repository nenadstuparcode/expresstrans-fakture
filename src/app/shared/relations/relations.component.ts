import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseCellComponent } from '@app/shared/base-cell/base-table-cell';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationsComponent extends BaseCellComponent {
  constructor() {
    super();
  }
}
