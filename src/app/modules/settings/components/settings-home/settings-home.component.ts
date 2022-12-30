import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PrintService } from '@app/common/print.service';
import { LoadingService } from '@app/services/loading.service';
import { catchError, filter, take, tap } from 'rxjs/operators';
import { MessageType } from '@app/services/loading.interface';
import { File } from '@ionic-native/file';
import { throwError } from 'rxjs';
import { IInvoice } from '@app/modules/invoice/invoice.interface';
import { PreviewComponent } from '@app/modules/invoice/components/preview/preview.component';
import { MatDialog } from '@angular/material/dialog';

export interface IReport {
  id: number;
  name: string;
  click: Function;
}
@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsHomeComponent {
  constructor(private ps: PrintService, private ls: LoadingService, private matDialog: MatDialog) {}
  public reports: IReport[] = [
    {
      id: 0,
      name: 'Sve fakture',
      click: () => this.printReport(0),
    },
    {
      id: 1,
      name: 'Fakture po mjesecima',
      click: () => this.printReport(1),
    },
    {
      id: 2,
      name: 'Kartica kupaca',
      click: () => this.printReport(2),
    },
    {
      id: 3,
      name: 'Neplaćene fakture',
      click: () => this.printReport(3),
    },
  ];

  public openDialog(pdf: string, invoice: IInvoice, response: ArrayBuffer) {
    this.matDialog.open(PreviewComponent, {
      data: { pdf: pdf, invoice: invoice, response: response },
    });
  }

  public printReport(type: number): void {
    switch (type) {
      case 0:
        return this.reportAll();
      case 1:
        return this.reportMonths();
      case 2:
        return this.reportByClients();
      case 3:
        return this.reportNotPaid();
    }
  }

  public reportMonths(): void {
    this.ls
      .start('Printanje izvještaja')
      .then(() => {
        this.ps
          .reportMonths()
          .pipe(
            filter((data: ArrayBuffer) => !!data),
            tap((response: ArrayBuffer) => {
              const file: Blob = new Blob([response], {
                type: 'application/pdf',
              });
              const url: string = URL.createObjectURL(file);
              this.ls.end();
              this.ls.showToast(MessageType.success);
              this.openDialog(URL.createObjectURL(file), null, response);
            }),
            catchError((err: Error) => {
              this.ls.end();
              this.ls.showToast(MessageType.err);
              return throwError(err);
            }),
            take(1),
          )
          .subscribe();
      })
      .catch((err: Error) => {
        this.ls.end();
        this.ls.showToast(MessageType.err);
        return throwError(err);
      });
  }
  public reportByClients(): void {
    this.ls
      .start('Printanje izvještaja')
      .then(() => {
        this.ps
          .reportByClients()
          .pipe(
            filter((data: ArrayBuffer) => !!data),
            tap((response: ArrayBuffer) => {
              const file: Blob = new Blob([response], {
                type: 'application/pdf',
              });
              const url: string = URL.createObjectURL(file);
              this.ls.end();
              this.ls.showToast(MessageType.success);
              this.openDialog(URL.createObjectURL(file), null, response);
            }),
            catchError((err: Error) => {
              this.ls.end();
              this.ls.showToast(MessageType.err);
              return throwError(err);
            }),
            take(1),
          )
          .subscribe();
      })
      .catch((err: Error) => {
        this.ls.end();
        this.ls.showToast(MessageType.err);
        return throwError(err);
      });
  }
  public reportNotPaid(): void {
    this.ls
      .start('Printanje izvještaja')
      .then(() => {
        this.ps
          .reportNotPaid()
          .pipe(
            filter((data: ArrayBuffer) => !!data),
            tap((response: ArrayBuffer) => {
              const file: Blob = new Blob([response], {
                type: 'application/pdf',
              });
              const url: string = URL.createObjectURL(file);
              this.ls.end();
              this.ls.showToast(MessageType.success);
              this.openDialog(URL.createObjectURL(file), null, response);
            }),
            catchError((err: Error) => {
              this.ls.end();
              this.ls.showToast(MessageType.err);
              return throwError(err);
            }),
            take(1),
          )
          .subscribe();
      })
      .catch((err: Error) => {
        this.ls.end();
        this.ls.showToast(MessageType.err);
        return throwError(err);
      });
  }
  public reportAll(): void {
    this.ls
      .start('Printanje izvještaja')
      .then(() => {
        this.ps
          .reportAll()
          .pipe(
            filter((data: ArrayBuffer) => !!data),
            tap((response: ArrayBuffer) => {
              const file: Blob = new Blob([response], {
                type: 'application/pdf',
              });
              const url: string = URL.createObjectURL(file);
              this.ls.end();
              this.ls.showToast(MessageType.success);
              this.openDialog(URL.createObjectURL(file), null, response);
            }),
            catchError((err: Error) => {
              this.ls.end();
              this.ls.showToast(MessageType.err);
              return throwError(err);
            }),
            take(1),
          )
          .subscribe();
      })
      .catch((err: Error) => {
        this.ls.end();
        this.ls.showToast(MessageType.err);
        return throwError(err);
      });
  }
}
