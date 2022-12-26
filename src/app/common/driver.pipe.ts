import { Pipe, PipeTransform } from '@angular/core';
import { GeneralDataService } from '@app/services/general-data.service';
import { IClient } from '@app/services/clients.interface';
import {IDriver} from "@app/modules/invoice/invoice.interface";

@Pipe({
  standalone: true,
  name: 'driverPipe',
  pure: true,
})
export class DriverPipe implements PipeTransform {
  constructor(private gds: GeneralDataService) {}
  public transform(code: string, ...args): any {
    const name: string = this.gds.allDrivers.find((c: IDriver) => c._id === code)?.name;

    if (name && code) {
      return name;
    }
    return code;
  }
}
