import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseCellComponent } from '@app/shared/base-cell/base-table-cell';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  standalone: true,
  imports: [CommonModule, MatCheckboxModule],
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxComponent extends BaseCellComponent {
  constructor() {
    super();
  }
}
