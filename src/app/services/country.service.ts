import {Injectable} from "@angular/core";

export interface Country {
  code: string
  code3: string
  name: string
  number: string
}

@Injectable()
export class CountryService {
  public countries: Country[] = [
    { code: "BA", code3: "BIH", name: "Bosna i Hercegovina", number: "070" },
    { code: "DE", code3: "DEU", name: "Njemačka", number: "276" },
    { code: "SI", code3: "SVN", name: "Slovenia", number: "705" },
    { code: "AT", code3: "AUT", name: "Austrija", number: "040" },
    { code: "HR", code3: "HRV", name: "Hrvatska", number: "191" },
    { code: "RS", code3: "SRB", name: "Srbija", number: "688" },
    { code: "FR", code3: "FRA", name: "Francuska", number: "250" },
    { code: "CH", code3: "CHE", name: "Švicarska", number: "756" },
    { code: "IT", code3: "ITA", name: "Italija", number: "380" },
    { code: "BE", code3: "BEL", name: "Belgija", number: "056" },
    { code: "AL", code3: "ALB", name: "Albanija", number: "008" },
    { code: "AD", code3: "AND", name: "Andorra", number: "020" },
    { code: "AO", code3: "AGO", name: "Angola", number: "024" },
    { code: "AZ", code3: "AZE", name: "Azarbejdžan", number: "031" },
    { code: "BY", code3: "BLR", name: "Bjelorusija", number: "112" },
    { code: "BG", code3: "BGR", name: "Bugarska", number: "100" },
    { code: "CY", code3: "CYP", name: "Kipar", number: "196" },
    { code: "CZ", code3: "CZE", name: "Češka", number: "203" },
    { code: "DK", code3: "DNK", name: "Danska", number: "208" },
    { code: "EE", code3: "EST", name: "Estonia", number: "233" },
    { code: "FI", code3: "FIN", name: "Finska", number: "246" },
    { code: "HU", code3: "HUN", name: "Mađarska", number: "348" },
    { code: "IE", code3: "IRL", name: "Irska", number: "372" },
    { code: "LI", code3: "LIE", name: "Lihtenštajn", number: "438" },
    { code: "LT", code3: "LTU", name: "Litvanija", number: "440" },
    { code: "LU", code3: "LUX", name: "Luksemburg", number: "442" },
    { code: "MD", code3: "MDA", name: "Moldova", number: "498" },
    { code: "MC", code3: "MCO", name: "Monako", number: "492" },
    { code: "ME", code3: "MNE", name: "Crna Gora", number: "499" },
    { code: "NL", code3: "NLD", name: "Holandija", number: "528" },
    { code: "NO", code3: "NOR", name: "Norveška", number: "578" },
    { code: "PL", code3: "POL", name: "Poljska", number: "616" },
    { code: "PT", code3: "PRT", name: "Portugal", number: "620" },
    { code: "SM", code3: "SMR", name: "San Marino", number: "674" },
    { code: "SK", code3: "SVK", name: "Slovačka", number: "703" },
    { code: "ES", code3: "ESP", name: "Španija", number: "724" },
    { code: "SE", code3: "SWE", name: "Švedska", number: "752" },
    { code: "UA", code3: "UKR", name: "Ukraina", number: "804" },
  ];
}
