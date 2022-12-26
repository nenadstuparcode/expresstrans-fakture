import { ChangeDetectionStrategy, Component, Inject, Input, Optional } from '@angular/core';
import { saveAs } from 'file-saver';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IInvoice } from '@app/modules/invoice/invoice.interface';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file';
import {throwError} from "rxjs";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { pdf: string; invoice: IInvoice },
    public platform: Platform,
  ) {}
  public download(): void {
    if (this.platform.is('mobile' || 'desktop')) {
      try {
        File.writeFile(
          File.externalRootDirectory,
          'izvjestaj-bih.pdf',
          new Blob([this.data.pdf], { type: 'application/pdf' }),
          {
            replace: true,
          },
        ).catch((error: Error) => throwError(error));

        File.writeFile(
          File.documentsDirectory,
          'izvjestaj-bih.pdf',
          new Blob([this.data.pdf], { type: 'application/pdf' }),
          {
            replace: true,
          },
        ).catch((error: Error) => throwError(error));
      } catch (err) {
        throwError(err);
      }
    }
    window.open(this.data.pdf);
    saveAs(this.data.pdf, `faktura_${this.data.invoice.invoicePublicId}.pdf`);
  }
}
