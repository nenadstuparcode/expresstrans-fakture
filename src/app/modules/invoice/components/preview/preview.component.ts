import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { saveAs } from 'file-saver';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IInvoice } from '@app/modules/invoice/invoice.interface';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file';
import { throwError } from 'rxjs';
import { LoadingService } from '@app/services/loading.service';
import { MessageType } from '@app/services/loading.interface';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { pdf: string; invoice: IInvoice; response: ArrayBuffer },
    public platform: Platform,
    public ls: LoadingService,
  ) {}


  public download(): void {
    if(!this.platform.is('android')) {
      window.open(this.data.pdf);
      saveAs(
        this.data.pdf,
        this.data.invoice
          ? `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf`
          : `izvjestaj_${this.generateDate()}.pdf`,
      );
    } else if (this.platform.is('android')) {

      File.writeExistingFile(
        File.externalRootDirectory,
        this.data.invoice
          ? `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf`
          : `izvjestaj_${this.generateDate()}.pdf`,
        new Blob([this.data.response], { type: 'application/pdf' }),
      )
        .then(() => {
          this.ls.showToast(MessageType.printSuccess);
        })
        .catch(() => {

          File.writeExistingFile(
            File.documentsDirectory,
            this.data.invoice
              ? `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf`
              : `izvjestaj_${this.generateDate()}.pdf`,
            new Blob([this.data.response], { type: 'application/pdf' }),
          )
            .then(() => {
              this.ls.showToast(MessageType.printSuccess);
            })
            .catch(() => {

              File.writeFile(
                File.externalRootDirectory,
                this.data.invoice
                  ? `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf`
                  : `izvjestaj_${this.generateDate()}.pdf`,
                new Blob([this.data.response], { type: 'application/pdf' }),
                {
                  append: true,
                  replace: false,
                }
              )
                .then(() => {
                  this.ls.showToast(MessageType.printSuccess);
                })
                .catch(() => {
                  File.writeExistingFile(
                    `${File.externalRootDirectory}/expresstrans`,
                    this.data.invoice
                      ? `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf`
                      : `izvjestaj_${this.generateDate()}.pdf`,
                    new Blob([this.data.response], { type: 'application/pdf' }),
                  )
                    .then(() => {
                      this.ls.showToast(MessageType.printSuccess);
                    })
                    .catch((err: Error) => {

                      return throwError(err);
                    });
                });

            });
        });
    }

  }

  public generateDate(): string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const ms = today.getMilliseconds();
    return dd + '' + mm + '' + yyyy + '_' + ms;
  }
}
