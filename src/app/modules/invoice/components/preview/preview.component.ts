import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IInvoice } from '@app/modules/invoice/invoice.interface';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file';
import { throwError } from 'rxjs';
import { LoadingService } from '@app/services/loading.service';
import { MessageType } from '@app/services/loading.interface';
import { save } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';
import { BaseDirectory } from '@tauri-apps/api/path';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  public isTauri: boolean = (window as any)?.isTauri;
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { pdf: string; invoice: IInvoice; response: ArrayBuffer },
    public platform: Platform,
    public ls: LoadingService,
  ) {}

  public async sendToPrinter(): Promise<void> {
    await invoke('printers', { pdf: this.data.response });
  }

  public async saveFile(data: { pdf: string; invoice: IInvoice; response: ArrayBuffer }): Promise<void> {
    try {
      if ((window as any).isTauri) {
        const defaultPath: string = this.data.invoice ?
          BaseDirectory.Desktop +`/faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf` :
          BaseDirectory.Desktop +`/izvjestaj_${this.generateDate()}.pdf`;
        const defaultFilter: string = this.data.invoice ? 'Faktura' : 'Izvjestaj';
        const filePath:string = await save({
          defaultPath: defaultPath,
          filters: [
            {
              name: defaultFilter,
              extensions: ['pdf', 'html'],
            },
          ],
          title: 'Izaberite folder za cuvanje fakture',
        });

        if(!filePath) return;

        await invoke('save_to_file', {path: filePath, content: data.response });
      } else {
        saveAs(new Blob([this.data.response], { type: 'application/pdf' }), this.data.invoice ?
          `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf` :
          `izvjestaj_${this.generateDate()}.pdf`)
      }

    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  public async download(): Promise<void> {
    if (!this.platform.is('android')) {
      await this.saveFile(this.data);
    } else if (this.platform.is('android')) {
      File.writeExistingFile(
        File.externalRootDirectory,
        this.data.invoice ?
          `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf` :
          `izvjestaj_${this.generateDate()}.pdf`,
        new Blob([this.data.response], { type: 'application/pdf' }),
      )
        .then(() => {
          this.ls.showToast(MessageType.printSuccess);
        })
        .catch(() => {
          File.writeExistingFile(
            File.documentsDirectory,
            this.data.invoice ?
              `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf` :
              `izvjestaj_${this.generateDate()}.pdf`,
            new Blob([this.data.response], { type: 'application/pdf' }),
          )
            .then(() => {
              this.ls.showToast(MessageType.printSuccess);
            })
            .catch(() => {
              File.writeFile(
                File.externalRootDirectory,
                this.data.invoice ?
                  `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf` :
                  `izvjestaj_${this.generateDate()}.pdf`,
                new Blob([this.data.response], { type: 'application/pdf' }),
                {
                  append: true,
                  replace: false,
                },
              )
                .then(() => {
                  this.ls.showToast(MessageType.printSuccess);
                })
                .catch(() => {
                  File.writeExistingFile(
                    `${File.externalRootDirectory}/expresstrans`,
                    this.data.invoice ?
                      `faktura_${this.data.invoice.invoicePublicId}_${this.generateDate()}.pdf` :
                      `izvjestaj_${this.generateDate()}.pdf`,
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
