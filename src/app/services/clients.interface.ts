export interface IClient {
  _id: string;
  name: string;
  info: string;
  address: string;
  city: string;
  zip: number;
  country: string;
  pib: string;
  contact: string;
  phone: string;
  createdAt?: string;
  position?: number;
  hasInvoiceToPay?: boolean;
}

export interface IClientPayload {
  name: string;
  info: string;
  address: string;
  city: string;
  zip: number;
  country: string;
  pib: string;
  phone: string;
}
