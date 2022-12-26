import { Pipe, PipeTransform } from '@angular/core';
import {CurrencyPipe} from "@angular/common";

@Pipe({
  standalone: true,
  name: 'tax',
  pure: true,
})
export class TaxPipe implements PipeTransform {
  constructor(public currencyPipe: CurrencyPipe) {}

  public transform(value: number, ...args): number {
    return value - (value / 1.17);
  }
}
