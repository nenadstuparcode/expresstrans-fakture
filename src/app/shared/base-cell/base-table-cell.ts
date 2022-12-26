import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TableColumn } from '@app/shared/table-shared/table-shared.interface';
import { Subject } from 'rxjs';

@Component({
  template: '',
})
export class BaseCellComponent {
  private _rowData: { [key: string]: any };
  private _cellValue: any;

  @Input() public set rowData(data: any) {
    this._rowData = data;
  }

  @Input() public set cellValue(cellValue: any) {
    this._cellValue = cellValue;
  }

  public get rowData(): { [key: string]: any } {
    return this._rowData;
  }

  public get cellValue(): any {
    return this._cellValue;
  }
}

@Component({
  template: '',
})
export class BaseTableCellComponent extends BaseCellComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() column: TableColumn;

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('cellRef', { read: ElementRef }) public cellRef: ElementRef;

  public customClass: string = '';
  public isStringTemplate: boolean;
  public componentRef: ComponentRef<any>;

  protected readonly componentDestroyed$: Subject<void> = new Subject<void>();
  constructor(@Optional() protected renderer?: Renderer2, @Optional() protected cd?: ChangeDetectorRef) {
    super();
  }

  public init(): void {
    this.customClass = this.column.customClass || '';
    this.cellValue = this.rowData[this.column.field];
    this.customClass = this.column.customClass;

    if (this.column.setTemplate) {
      this.column = {
        ...this.column,
        template: this.column.setTemplate(this.rowData[this.column.field], this.rowData),
      };
    }
  }

  public ngAfterViewInit(): void {
    if (this.customClass && this.cellRef && this.column) {
      this.renderer.addClass(this.cellRef.nativeElement.parentElement, this.customClass);
    }

    if (!this.column.customComponent) return;

    this.componentRef = this.container.createComponent(this.column.customComponent);

    if ('rowData' in this.componentRef.instance) {
      this.componentRef.instance.rowData = this.rowData;
    }

    if ('cellValue' in this.componentRef.instance) {
      this.componentRef.instance.cellValue = this.cellValue;
    }

    this.componentRef.changeDetectorRef.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.column) {
      const columnData: TableColumn = changes.column.currentValue;

      this.isStringTemplate = !!columnData.setTemplate || typeof changes.column.currentValue.template === 'string';
    }

    this.init();
  }

  public detectChanges(): void {
    if (!this.componentRef.instance) return;

    this.componentRef.instance.cellValue = this.cellValue;
    this.componentRef.instance.rowData = this.rowData;

    this.componentRef.changeDetectorRef.detectChanges();
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
