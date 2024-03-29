import { TemplateRef } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

export interface TableColumn {
  caption: string;
  field: string;
  customClass: string;
  cell?: Function;
  clickFn?: Function;
  template?: TemplateRef<any>;
  customComponent?: any;
  setTemplate?: Function;
  dynamicPipe?: string;
  valueFormatter?: Function;
  align?: string;
  width?: string;
  sticky?: boolean;
  footer?: Function;
  showFooter?: boolean;
}
