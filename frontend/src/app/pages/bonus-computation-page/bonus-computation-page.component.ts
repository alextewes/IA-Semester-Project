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
    {field: 'prid', headerName: 'PrId', sortable: true, flex: 1},
    /*{field: 'category', headerName: ' Category', sortable: true, flex: 1},*/
    {field: 'actualValue', headerName: 'Actual Value', sortable: true, editable: true, flex: 1},
    {field: 'targetValue', headerName: 'Target Value', sortable: true, editable: true, flex: 1},
    {field: 'year', headerName: 'Year', sortable: true, editable: true, flex: 1},
    {field: 'goalDesc', headerName: 'Goal Description', sortable: true, editable: true, flex: 1},
    {field: 'sid', headerName: 'Sid', sortable: true, editable: true, flex: 1},
  ];
  performanceRowData = [
    /*{category: 'Leadership Competence', targetValue: 4, actualValue: 3, bonus: 20},
    {category: 'Openness to Employee', targetValue: 4, actualValue: 3, bonus: 20},
    {category: 'Social Behaviour to Employee', targetValue: 4, actualValue: 3, bonus: 100},
    {category: 'Attitude towards Client', targetValue: 4, actualValue: 3, bonus: 20},
    {category: 'Communication Skills', targetValue: 4, actualValue: 3, bonus: 50},
    {category: 'Integrity to Company', targetValue: 4, actualValue: 3, bonus: 20}*/
  ];
  myControl = new FormControl();
  myControl1 = new FormControl();
  options: string[];
  @Input() currentValue = '2021';
  filteredOptions: Observable<string[]>;
  bonuses = {
    totalBonusAB: 10,
    totalBonusA: 10,
    totalBonusB: 10
  };

  /*@Input() totalBonusAB: number;
  @Output() totalBonusABChange = new EventEmitter<number>();*/

  method(event): void {
    this.ordersRowData.forEach(element => {
      this.bonuses.totalBonusA = +element.bonus;
    });
    this.performanceRowData.forEach(x => {
      this.bonuses.totalBonusB = +x.bonus;
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

  getSalesOrders(sid: number): void {
    this.salesOrderService.getSalesOrders(sid)
      .subscribe((data: SalesOrder[]) => {
          this.ordersRowData = data;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }
  getPerformanceRecords(): void {
    this.performanceRecordService.getPerformanceRecords()
      .subscribe((data: PerformanceRecord[]) => {
          this.performanceRowData = data;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }
  onSelectionChanged(event): void{
    const selectedRows = event.api.getSelectedRows();
    console.log(selectedRows.length === 1 ? selectedRows[0].firstName : '');
    if (selectedRows.length === 1){
      Object.entries(selectedRows[0]).forEach(([key, value]) => {
        this.selectedSalesman[key] = value;
      });
    }
  }
  ngOnInit(): void {
    this.getSalesmen();

    this.getPerformanceRecords();
    this.myControl.setValue('2021');
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.salesmenRowData.forEach((element) => {
      this.options.push(element.firstName + '' + element.lastName);
    });
    // this.getSalesOrders(sid);
    // this.getBonusComputations(2021,);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
