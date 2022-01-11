export interface SalesOrder{
  _id: string;
  sid: number;
  year: number;
  product: string;
  customerName: string;
  clientRanking: number | string;
  items: number;
  bonus: number;
}
