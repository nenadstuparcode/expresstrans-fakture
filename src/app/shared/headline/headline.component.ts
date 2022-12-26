import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
export enum IHeadlineSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-headline',
  templateUrl: './headline.component.html',
  styleUrls: ['./headline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadlineComponent {
  @Input() title: string | null = 'null';
  @Input() size: IHeadlineSize = IHeadlineSize.medium;
}
