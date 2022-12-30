import {ChangeDetectionStrategy, Component} from '@angular/core';
import { Location } from "@angular/common";
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientComponent {
  constructor(private location: Location) {
  }
  public goBack(): void {
    this.location.back();
  }
}


