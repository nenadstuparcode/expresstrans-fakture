import {Pipe, PipeTransform} from "@angular/core";
import {Country, CountryService} from "@app/services/country.service";
import {GeneralDataService} from "@app/services/general-data.service";
import {IClient} from "@app/services/clients.interface";
import {filter, take} from "rxjs/operators";

@Pipe({
  standalone: true,
  name: 'client',
  pure: true,
})
export class ClientPipe implements PipeTransform {
  constructor(private gds: GeneralDataService) {}
  public transform(code: string, ...args): any {
    const name: string = this.gds.allClients.find((c: IClient) => c._id === code)?.name;

    if(name && code) {
      return name
    }
    return code;
  }
}
