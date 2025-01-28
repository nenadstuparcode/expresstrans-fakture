import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { TableColumn } from '@app/shared/table-shared/table-shared.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { TableCellComponent } from '@app/shared/base-cell/base-cell.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule, MatIconModule, MatProgressSpinnerModule, TableCellComponent],
  providers: [MatTableModule, DatePipe],
  selector: 'table-shared',
  templateUrl: './table-shared.component.html',
  styleUrls: ['./table-shared.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableSharedComponent {
  @Input() public columnsConfig: TableColumn[] = [];
  @Input() public displayedColumns: string[] = [];
  @Input() public footerColumns: string[] = ['1','2'];
  @Input() public dataSource$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  @Input() public isLoadingResults: boolean;
  @Input() public hasErrorLoading: boolean;
  @Output() public onRowClick: EventEmitter<string> = new EventEmitter<string>();

  public clickAction = (itemId: string) => this.onRowClick.emit(itemId);
  public trackByFn = (index: number, item: any) => item;
}
