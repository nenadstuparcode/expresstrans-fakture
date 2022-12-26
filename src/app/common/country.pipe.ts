import {Pipe, PipeTransform} from "@angular/core";
import {Country, CountryService} from "@app/services/country.service";

@Pipe({
  standalone: true,
  name: 'country',
  pure: true,
})
export class CountryPipe implements PipeTransform {
  constructor(private cs: CountryService) {}
  public transform(code: string, ...args): any {
    const name: string = this.cs.countries.find((c: Country) => c.code === code)?.name;

    if(name && code) {
      return name
    }
    return code;
  }
}
