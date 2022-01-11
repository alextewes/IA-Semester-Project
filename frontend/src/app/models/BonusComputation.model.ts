export interface BonusComputation{
  _id?: string;
  sid: number;
  year: number;
  value: number;
  performanceRecords: string[];
  salesOrders: string[];
  remarks: string;
  status: number;
}
