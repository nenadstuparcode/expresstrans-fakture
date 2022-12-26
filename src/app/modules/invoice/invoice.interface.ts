export interface ICreateInvoicePayload {
  invoiceDateStart: string;
  invoiceDateReturn: string;
  invoiceVehicle: string;
  invoiceDrivers: string[];
  invoiceExpCro: number;
  invoiceExpSlo: number;
  invoiceExpAus: number;
  invoiceExpGer: number;
  invoiceInitialExpenses: number;
  invoiceInitialExpensesDesc: string;
  invoiceUnexpectedExpenses: number;
  invoiceUnexpectedExpensesDesc: string;
  totalKilometers: number;
  bihKilometers: number;
  diffKilometers: number;
  firstCalculation: number;
  secondCalculation: number;
  returnTaxBih: number;
  invoiceNumber: number;
  invoicePublicId: number;

  //new props
  invoiceType : InvoiceType;
  invoiceRelations: IRelation[];
  cmr : IName[];
  deadline: string;
  priceKm: number;
  priceEuros: number;
  accountNumber: string;
  invoiceTrailer: IName[];
  payed: boolean;
  priceKmTax: number;
  invDriver: string;
  invTrailer: string;
  useTotalPrice: boolean;
}

export interface IUpdateInvoicePayload {
  invoiceExpCro: number;
  invoiceExpSlo: number;
  invoiceExpAus: number;
  invoiceExpGer: number;
  invoiceInitialExpenses: number;
  invoiceInitialExpensesDesc: string;
  invoiceUnexpectedExpenses: number;
  invoiceUnexpectedExpensesDesc: string;
  invoiceDrivers: IDriver[];
}

export interface Relation {
  _id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
}

export interface IRelation {
  name: string;
  priceKm: number;
  priceEur: number;
  priceKmTax: number;
  kilometers: number;
}

export interface IDriver {
  _id: string;
  name: string;
  createdAt: string;
  modifiedAt: string;
}

export interface IUpdateInvoicePayloadTax {
  totalKilometers: number;
  bihKilometers: number;
  diffKilometers: number;
  firstCalculation: number;
  secondCalculation: number;
  returnTaxBih: number;
  invoiceDrivers: IDriver[];
}

export interface ICreateInvoiceResponse {
  _id: string;
  invoiceNumber: number;
  invoiceDateStart: string;
  invoiceDateReturn: string;
  invoiceVehicle: string;
  invoiceExpCro: number;
  invoiceExpSlo: number;
  invoiceExpAus: number;
  invoiceExpGer: number;
  invoiceInitialExpenses: number;
  invoiceInitialExpensesDesc: string;
  invoiceUnexpectedExpenses: number;
  invoiceUnexpectedExpensesDesc: string;
  totalKilometers: number;
  bihKilometers: number;
  diffKilometers: number;
  firstCalculation: number;
  secondCalculation: number;
  returnTaxBih: number;
  invoiceDrivers: string[];
  invoicePublicId: number;


  //new props
  invoiceType : InvoiceType;
  invoiceRelations: string[];
  cmr : IName[];
  deadline: string;
  priceKm: number;
  priceEuros: number;
  accountNumber: string;
  invoiceTrailer: IName[];
  payed: boolean;
  priceKmTax: number;
  invDriver: string;
  invTrailer: string;
  useTotalPrice: boolean;
}

export interface IInvoice {
  _id: string;
  invoiceNumber: number;
  invoiceDateStart: string;
  invoiceDateReturn: string;
  invoiceVehicle: string;
  invoiceExpCro: number;
  invoiceExpSlo: number;
  invoiceExpAus: number;
  invoiceExpGer: number;
  invoiceInitialExpenses: number;
  invoiceInitialExpensesDesc: string;
  invoiceUnexpectedExpenses: number;
  invoiceUnexpectedExpensesDesc: string;
  totalKilometers: number;
  bihKilometers: number;
  diffKilometers: number;
  firstCalculation: number;
  secondCalculation: number;
  returnTaxBih: number;
  invoiceTotalBill: number;
  invoiceDrivers: any[];
  driversArray?: string;
  createdAt: string;
  invoicePublicId: number;
  user: string;
  modifiedAt: string;

  //new props
  invoiceType : InvoiceType;
  invoiceRelations: IRelation[];
  cmr : IName[];
  deadline: string;
  priceKm: number;
  priceEuros: number;
  accountNumber: string;
  invoiceTrailer: IName[];
  payed: boolean;
  priceKmTax: number;
  clientId: string;
  invDriver: string;
  invTrailer: string;
  // optional props FE added
  clientName?: string;
  type?: string;
  useTotalPrice: boolean;
  bam?: string;
  eur?: string;
  tax?: string;
  clientUniqueId?: string;
}

export interface IName {
  name: string;
}

export interface IAutoCompleteItem {
  name: string;
  id: any;
}

export enum InvoiceType {
  bus = 'bus',
  cargo = 'cargo',
}
