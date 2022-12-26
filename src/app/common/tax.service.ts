import { Injectable } from '@angular/core';
import {CurrencyMaskConfig} from "ng2-currency-mask";

export enum IExchangeType {
  eurToBam= 'euroToBam',
  bamToEur= 'bamToEur',
}

@Injectable({
  providedIn: 'any',
})
export class TaxService {
  public configEuro:CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: " €",
    thousands: "."
  };

  public configBam:CurrencyMaskConfig = {
    align: "right",
    allowNegative: false,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: " KM",
    thousands: "."
  };

  public convertCurrency(exchangeType: string, value: number): number {
    if(value && !!value) {
      switch (exchangeType) {
        case IExchangeType.bamToEur: return value * 0.51129;
        case IExchangeType.eurToBam: return value * 1.95583;
        default: return 0;
      }
    }
  }
}
