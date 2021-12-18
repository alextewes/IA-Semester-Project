import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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
    {field: '_id', headerName: 'SID', sortable: true, flex: 1},
    {field: 'employeeId', headerName: 'EmployeeId', sortable: true, flex: 1},
    {field: 'firstName', headerName: 'First Name', sortable: true, flex: 1},
    {field: 'lastName', headerName: 'Last Name', sortable: true, flex: 1},
    {field: 'dob', headerName: 'Date of Birth', sortable: true, flex: 1},
    {field: 'department', headerName: 'Department', sortable: true, flex: 1},
  ];
  salesmenRowData = [];

  ordersColumnDefs: ColDef[] = [
    {field: 'sid', headerName: 'Sid', sortable: true, flex: 1},
    {field: 'year', headerName: 'Year', sortable: true, flex: 1},
    {field: 'product', headerName: 'Name of Product', sortable: true, flex: 1},
    {field: 'customerName', headerName: 'Customer name', sortable: true, flex: 1},
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
    {field: 'actualValue', headerName: 'Actual Value', sortable: true, editable: true, flex: 1},
    {field: 'targetValue', headerName: 'Target Value', sortable: true, editable: true, flex: 1},
    {field: 'year', headerName: 'Year', sortable: true, editable: true, flex: 1},
    {field: 'goalDesc', headerName: 'Goal Description', sortable: true, editable: true, flex: 1},
    {field: 'bonus', headerName: 'Bonus', sortable: true, editable: true, flex: 1},
    {field: 'sid', headerName: 'Sid', sortable: true, editable: true, flex: 1}
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
    this.ordersRowData.forEach(element => {
      this.bonuses.totalBonusA += parseInt(element.bonus, 0);
      console.log(element.bonus);
    });
    this.performanceRowDataEmpty.forEach(x => {
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
          this.ordersRowData = data;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  getPerformanceRecordsBySid(sid: number): void {
    this.performanceRecordService.getPerformnanceRecordsById(sid)
      .subscribe((data: PerformanceRecord[]) => {
          // this.performanceRowDataEmpty = data;
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
    this.performanceRecordService.postPeformanceRcord(performanceRecord)
      .subscribe(res => {
          console.log(res);
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
      this.getSalesOrders(this.selectedSalesman._id, this.myControl.value);
      this.performanceRowData = this.performanceRowDataEmpty;
    }
  }
  export(): void{
    /* let bonusComputation: BonusComputation;
    bonusComputation.sid = this.selectedSalesman._id;
    bonusComputation.year = parseInt(this.myControl.value(), 10);
    bonusComputation.value = this.bonuses.totalBonusAB;
    this.ordersRowData.forEach((order) => bonusComputation.salesOrders.push(order._id));
    this.performanceRowData.forEach((performance) => {performance.sid = this.selectedSalesman._id;
    this.postPerformanceRecord(performance)});
    this.getPerformanceRecordsBySid(this.selectedSalesman._id);
    this.performanceRowData.forEach((performance) => bonusComputation.performanceRecords.push(performance._id));
    this.postBonusComputation(bonusComputation); */
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
  clearInput(): void{
    this.autoCompleteControl.setValue('');
    filterValue = '';
    this.salesmenGridApi.onFilterChanged();
  }
  checkInput(): void{
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
