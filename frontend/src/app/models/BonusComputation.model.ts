import {PerformanceRecord} from './PerformanceRecord.model';

export interface BonusComputation{
  _id: string;
  sid: number;
  year: number;
  value: number;
  performanceRecords: PerformanceRecord[];
  salesOrders: string;
}
