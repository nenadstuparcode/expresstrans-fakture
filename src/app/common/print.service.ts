import { Injectable } from '@angular/core';
export interface IPrintOption {
  name: string;
  id: number;
}
@Injectable({
  providedIn: 'any',
})
export class PrintService {
  constructor() {}
  public printingOptions: IPrintOption[] = [
    {
      name: 'Izvoz domaći kupci',
      id: 1,
    },
    {
      name: 'Uvoz dvije relacije',
      id: 2,
    },
    {
      name: 'Uvoz jedna relacija',
      id: 3,
    },
    {
      name: 'Strani kupci na srpskom',
      id: 4,
    },
    {
      name: 'Fakture sa PDV-om',
      id: 5,
    },
    {
      name: 'Vanredne autobus',
      id: 6,
    },
    {
      name: 'Fakture za autobus KM',
      id: 7,
    },
    {
      name: 'Fakture za autobus EUR',
      id: 8,
    },
  ];
}
