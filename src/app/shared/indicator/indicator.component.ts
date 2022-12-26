import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseCellComponent } from '@app/shared/base-cell/base-table-cell';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorComponent extends BaseCellComponent {
  constructor() {
    super();
  }
}
