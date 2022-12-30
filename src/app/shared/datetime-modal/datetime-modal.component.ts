import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";

@Component({
  standalone: true,
  imports: [MatDatepickerModule, CommonModule, IonicModule],
  providers: [MatDatepickerModule],
  selector: 'app-datetime-modal',
  templateUrl: './datetime-modal.component.html',
  styleUrls: ['./datetime-modal.component.scss'],
})
export class DatetimeModalComponent {
  @ViewChild('popoverDate') public popoverDate: any;
  public today: Date = new Date();
  public myToday: string = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate(),
    0,
    0,
    0,
  ).toISOString();
  public dateToSend: string;

  constructor(public dialogRef: MatDialogRef<DatetimeModalComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {}

  public setDate(date: any): void {
    if(this.data === 'time') {
      this.dateToSend = date;
    } else {
      this.confirmDate(date);
    }
  }

  public confirmDate(date: any): void {
    console.log(date);
    this.popoverDate.confirm();
    setTimeout(() => {
      this.dialogRef.close(date);
    }, 300);
  }

  public onNoClick(): void {
    this.popoverDate.cancel();
    setTimeout(() => {
      this.dialogRef.close();
    }, 300);
  }
}
