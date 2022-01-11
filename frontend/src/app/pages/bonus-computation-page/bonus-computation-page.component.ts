import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {from, Observable, of} from 'rxjs';
import {concatMap, map, mergeMap, startWith} from 'rxjs/operators';
import {BonusComputationService} from '../../services/bonus-computation.service';
import {BonusComputation} from '../../models/BonusComputation.model';
import {HttpErrorResponse} from '@angular/common/http';
import {Salesman} from '../../models/Salesman.model';
import {SalesmanService} from '../../services/salesman.service';
import {SalesorderService} from '../../services/salesorder.service';
import {SalesOrder} from '../../models/SalesOrder.model';
import {PerformanceRecordService} from '../../services/performance-record.service';
import {PerformanceRecord} from '../../models/PerformanceRecord.model';

@Component({
  selector: 'app-bonus-computation-page',
  templateUrl: './bonus-computation-page.component.html',
  styleUrls: ['./bonus-computation-page.component.css']
})
export class BonusComputationPageComponent implements OnInit {
  public bonusComputations: BonusComputation[];
  public rowSelection = 'single';

  constructor(private bonusComputationService: BonusComputationService,
              private salesmanService: SalesmanService,
              private salesOrderService: SalesorderService,
              private performanceRecordService: PerformanceRecordService) {
  }

  @Input() selectedSalesman: Salesman = {} as Salesman;
  public yOP: number;
  years = 2030;
  salesmenColumnDefs: ColDef[] = [
   /* {field: '_id', headerName: 'SID', sortable: true, flex: 1},*/
    {field: 'employeeId', headerName: 'EmployeeId', sortable: true, flex: 1},
    {field: 'firstName', headerName: 'First Name', sortable: true, flex: 1},
    {field: 'lastName', headerName: 'Last Name', sortable: true, flex: 1},
    {field: 'dob', headerName: 'Date of Birth', sortable: true, flex: 1},
    {field: 'department', headerName: 'Department', sortable: true, flex: 1},
  ];
  salesmenRowData = [];

  ordersColumnDefs: ColDef[] = [
    /*{field: 'sid', headerName: 'Sid', sortable: true, flex: 1},*/
    /*{field: 'year', headerName: 'Year', sortable: true, flex: 1},*/
    {field: 'product', headerName: 'Product', sortable: true, flex: 1},
    {field: 'customerName', headerName: 'Customer', sortable: true, flex: 1},
    {field: 'clientRanking', headerName: 'Client Ranking', sortable: true, flex: 1},
    {field: 'items', headerName: 'Items', sortable: true, flex: 1},
    {field: 'bonus', headerName: 'Bonus', sortable: true, editable: true, flex: 1},
  ];
  ordersRowData = [/*
    {productName: 'HooverGo', client: 'Telekom', clientRanking: 'excellent', items: 20700, bonus: 200},
    {productName: ' ', client: 'Mayer Werft AG', clientRanking: 'very good', items: 10, bonus: 500},
    {productName: ' ', client: '', clientRanking: '', Items: 0, Bonus: 0},
    {productName: 'HooverClean ', client: 'Germania GmbH', clientRanking: 'good', items: 10, bonus: 200},*/
  ];
  performanceColumnDefs: ColDef[] = [
    /*{field: 'prid', headerName: 'PrId', sortable: true, flex: 1},*/
    /*{field: 'sid', headerName: 'Sid', sortable: true, flex: 1},*/
    {field: 'goalDesc', headerName: 'Goal', sortable: true, editable: true, flex: 1},
    {field: 'actualValue', headerName: 'Actual Value', sortable: true, editable: true, flex: 1},
    {field: 'targetValue', headerName: 'Target Value', sortable: true, editable: true, flex: 1},
    /*{field: 'year', headerName: 'Year', sortable: true, flex: 1},*/
    {field: 'bonus', headerName: 'Bonus', sortable: true, editable: true, flex: 1},
  ];
  performanceRowData = [];
  performanceRowDataEmpty = [
    {goalDesc: 'Leadership Competence', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
    {goalDesc: 'Openness to Employee', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
    {goalDesc: 'Social Behaviour to Employee', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
    {goalDesc: 'Attitude towards Client', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
    {goalDesc: 'Communication Skills', targetValue: 0, actualValue: 0, bonus: 0, sid: 0},
    {goalDesc: 'Integrity to Company', targetValue: 0, actualValue: 0, bonus: 0, sid: 0}
  ];
  myControl = new FormControl();
  myControl1 = new FormControl();
  autoCompleteControl = new FormControl();
  filteredAutoCompleteOptions: Observable<string[]>;
  salesmenGridApi;
  options: string[];
  @Input() currentValue = '2021';
  filteredOptions: Observable<string[]>;
  bonuses = {
    totalBonusAB: 0,
    totalBonusA: 0,
    totalBonusB: 0
  };

  /*@Input() totalBonusAB: number;
  @Output() totalBonusABChange = new EventEmitter<number>();*/

  updateBonus(event): void {
    this.bonuses.totalBonusA = 0;
    this.ordersRowData.forEach(element => {
      this.bonuses.totalBonusA += parseInt(element.bonus, 0);
      console.log(element.bonus);
    });
    this.bonuses.totalBonusB = 0;
    this.performanceRowData.forEach(x => {
      this.bonuses.totalBonusB += Number(x.bonus);
    });
    this.bonuses.totalBonusAB = this.bonuses.totalBonusA + this.bonuses.totalBonusB;
  }

  getBonusComputations(sid: number, year: number): void {
    this.bonusComputationService.getBonusComputations(sid, year)
      .subscribe((data: BonusComputation[]) => {
          this.bonusComputations = data;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  getSalesmen(): void {
    this.salesmanService.getSalesmen()
      .subscribe((data: Salesman[]) => {
          this.salesmenRowData = data;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  getSalesOrders(sid: number, year: number): void {
    this.salesOrderService.getSalesOrders(sid, year)
      .subscribe((data: SalesOrder[]) => {
          const augmentedData: SalesOrder[] = data;
          augmentedData.forEach(d => d.clientRanking = this.clientRankingToString(d.clientRanking));
          this.ordersRowData = augmentedData;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  clientRankingToString(ranking): string | number {
    let res: string | number = '';
    switch (ranking) {
      case 1:
        res = 'ok';
        break;
      case 2:
        res = 'good';
        break;
      case 3:
        res = 'very good';
        break;
      case 4:
        res = 'excellent';
        break;
      case 'ok':
        res = 1;
        break;
      case 'good':
        res = 2;
        break;
      case 'very good':
        res = 3;
        break;
      case 'excellent':
        res = 4;
        break;
      default:
        res = 'no valid ranking';
    }
    return res;
  }
  clientRankingToNumber(ranking: string): number{
    let res = 0;
    switch (ranking) {
      case 'ok':
        res = 1;
        break;
      case 'good':
        res = 2;
        break;
      case 'very good':
        res = 3;
        break;
      case 'excellent':
        res = 4;
        break;
      default:
        res = 0;
    }
    return res;
  }
  getPerformanceRecordsBySidAndYear(sid: number, year): void {
    this.performanceRecordService.getPerformanceRecordsBySidAndYear(sid, year)
      .subscribe((data: PerformanceRecord[]) => {
          this.performanceRowDataEmpty = data;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  postBonusComputation(bonusComputation: BonusComputation): void {
    this.bonusComputationService.postBonusComputation(bonusComputation)
      .subscribe(res => {
          console.log(res);
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  postPerformanceRecord(performanceRecord: PerformanceRecord): void {
    this.performanceRecordService.postPeformanceRecord(performanceRecord)
      .subscribe(res => {
          console.log(res);
        },
        (error: HttpErrorResponse) => {
          return error.message;
        });
  }

  getPerformanceRecordsBySidAfterUpdate(sid: number, year): void {
    this.performanceRecordService.getPerformanceRecordsBySidAndYear(sid, year)
      .subscribe((data: PerformanceRecord[]) => {
          // this.performanceRowDataEmpty = data;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  onSelectionChanged(event): void {
    const selectedRows = event.api.getSelectedRows();
    console.log(selectedRows.length === 1 ? selectedRows[0].firstName : '');
    if (selectedRows.length === 1) {
      Object.entries(selectedRows[0]).forEach(([key, value]) => {
        this.selectedSalesman[key] = value;
      });
      const obS = new Observable<Salesman>();
      const obSO = this.salesOrderService.getSalesOrders(this.selectedSalesman._id, this.myControl.value);
      const obP = this.performanceRecordService.getPerformanceRecordsBySidAndYear(this.selectedSalesman._id, this.myControl.value);
      obSO.subscribe(salesOrders => obP.subscribe(performances => {
        const augmentedData: SalesOrder[] = salesOrders;
        augmentedData.forEach(d => d.clientRanking = this.clientRankingToString(d.clientRanking));
        if (augmentedData.length > 0){
          this.ordersRowData = augmentedData;
          if (performances.length !== 0) {
            this.performanceRowData = performances;
          } else {
            this.performanceRowData = this.performanceRowDataEmpty;
          }
          this.updateBonus(' ');
        }
        else{
          this.ordersRowData = [];
          this.performanceRowData = [];
        }
      } ), (err) => {}, () => {console.log(this.ordersRowData.length); });
    }
  }

  export(): void {
    const bonusComputation: BonusComputation = {sid: 0, year: 0, value: 0, salesOrders: [], performanceRecords: [], remarks: '', status: 1};
    bonusComputation.sid = this.selectedSalesman._id;
    bonusComputation.year = parseInt(this.myControl.value, 10);
    bonusComputation.value = this.bonuses.totalBonusAB;
    bonusComputation.remarks = '';
    bonusComputation.status = 1;
    this.ordersRowData.forEach((order) => {this.clientRankingToString(order.clientRanking); bonusComputation.salesOrders.push(order._id); });
    Promise.all(this.performanceRowData.map((performance) => {
      performance.sid = this.selectedSalesman._id;
      performance.year = this.myControl.value;
      return this.performanceRecordService.postPeformanceRecord(performance).toPromise();
    })).then(r => console.log(r));
    /* this.performanceRowData.forEach((performance) => {
       performance.sid = this.selectedSalesman._id;
       performance.year = this.myControl.value;
       this.postPerformanceRecord(performance); });*/
    this.performanceRecordService.getPerformanceRecordsBySidAndYear(this.selectedSalesman._id, parseInt(this.myControl.value, 10))
      .toPromise().then(x => {
      x.forEach(item => bonusComputation.performanceRecords.push(item._id));
      this.postBonusComputation(bonusComputation);
    });

  }
  dependentSubscription(): void {
    const obS = this.salesmanService.getSalesmen();
    const obP = this.performanceRecordService.getPerformanceRecords();
    obS.subscribe(salesmen => obP.subscribe(performances => salesmen.forEach((salesman, idx) => console.log(salesman.firstName + ':' + performances[idx].goalDesc))));
  }
  ngOnInit(): void {
    this.getSalesmen();
    this.myControl.setValue('2021');
    this.salesmenRowData.forEach((element) => {
      this.options.push(element.firstName + '' + element.lastName);
    });
    this.filteredAutoCompleteOptions = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const fValue = value.toLowerCase();
    const filteredSalesmen = this.salesmenRowData.filter(option => {
      return (option.firstName + ' ' + option.lastName).toLowerCase().includes(fValue);
    });
    return filteredSalesmen.map(salesman => salesman.firstName);
  }

  onGridReady(params): void {
    this.salesmenGridApi = params.api;
  }

  onSelFunc(option): void {
    filterValue = option;
    console.log(filterValue);
    this.salesmenGridApi.onFilterChanged();
  }

  clearInput(): void {
    this.autoCompleteControl.setValue('');
    filterValue = '';
    this.salesmenGridApi.onFilterChanged();
  }

  checkInput(): void {
    filterValue = this.autoCompleteControl.value;
    console.log(this.autoCompleteControl.value);
    this.salesmenGridApi.onFilterChanged();
  }

  isExternalFilterPresent(): boolean {
    console.log(filterValue !== '');
    return filterValue !== '';
  }

  doesExternalFilterPass(node): boolean {
    return node.data.firstName.toLowerCase().includes(filterValue.toLowerCase());
  }
}

let filterValue = '';
