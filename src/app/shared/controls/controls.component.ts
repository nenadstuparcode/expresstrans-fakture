import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

export interface IControl {
  name: string;
  icon: string;
  action: any;
  color: string | null;
}

@Component({
  standalone: true,
  imports: [CommonModule, IonicModule],
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent {
  public controls: any[] = [
    {
      name: 'plus',
      icon: 'add-outline',
      action: () => this.clickControl('add'),
      color: 'success',
      customClass: '',
    },
    {
      name: 'delete',
      icon: 'trash-outline',
      action: () => this.clickControl('delete'),
      color: 'danger',
      customClass: 'mr-3',
    },
    {
      name: 'back',
      icon: 'caret-back-outline',
      action: () => this.clickControl('back'),
      color: null,
      customClass: '',
    },
    {
      name: 'forward',
      icon: 'caret-forward-outline',
      action: () => this.clickControl('forward'),
      color: null,
      customClass: '',
    }
  ];

  public clickControl(controlName: string): void {
      console.log(controlName);
  }
}
