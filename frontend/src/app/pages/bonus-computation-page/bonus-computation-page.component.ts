import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {forkJoin, Observable, zip} from 'rxjs';
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
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';
import {performanceRowDataEmpty, salesmenColumnDefs } from './GridDefinitions';
@Component({
  selector: 'app-bonus-computation-page',
  templateUrl: './bonus-computation-page.component.html',
  styleUrls: ['./bonus-computation-page.component.css']
})
export class BonusComputationPageComponent implements OnInit {
  public bonusComputations: BonusComputation[];
  public rowSelection = 'single';

  @Input() public currentUser: User = {} as User;
  @Input() selectedSalesman: Salesman = {} as Salesman;
  private currentBonusComputation: BonusComputation;

  constructor(private bonusComputationService: BonusComputationService,
              private salesmanService: SalesmanService,
              private salesOrderService: SalesorderService,
              private performanceRecordService: PerformanceRecordService,
              private userService: UserService) {
  }

  salesmenColumnDefs: ColDef[] = salesmenColumnDefs;
  salesmenRowData = [];

  ordersColumnDefs: ColDef[] = [
    {field: 'product', headerName: 'Product', sortable: true, flex: 1},
    {field: 'customerName', headerName: 'Customer', sortable: true, autoHeight: true, wrapText: true, flex: 1},
    {field: 'clientRanking', headerName: 'Client Ranking', sortable: true, flex: 1},
    {field: 'items', headerName: 'Items', sortable: true, flex: 1},
    {
      field: 'bonus',
      headerName: 'Bonus',
      sortable: true,
      editable: this.currentUser.role === 3 || this.currentUser.role === 2 ? false : true,
      flex: 1
    },
  ];
  /*{productName: 'HooverClean ', client: 'Germania GmbH', clientRanking: 'good', items: 10, bonus: 200},*/
  ordersRowData = [
  ];
  performanceColumnDefs: ColDef[] = [
    {
      field: 'goalDesc',
      headerName: 'Goal',
      sortable: true,
      editable: this.currentUser.role === 3 || this.currentUser.role === 2 ? false : true,
      autoHeight: true,
      wrapText: true,
      flex: 1
    },
    {
      field: 'actualValue',
      headerName: 'Actual Value',
      sortable: true,
      editable: this.currentUser.role === 3 || this.currentUser.role === 2 ? false : true,
      flex: 1
    },
    {
      field: 'targetValue',
      headerName: 'Target Value',
      sortable: true,
      editable: this.currentUser.role === 3 || this.currentUser.role === 2 ? false : true,
      flex: 1
    },
    {
      field: 'bonus',
      headerName: 'Bonus',
      sortable: true,
      editable: this.currentUser.role === 3 || this.currentUser.role === 2 ? false : true,
      flex: 1
    },
  ];
  performanceRowData = [];
  performanceRowDataEmpty = performanceRowDataEmpty;
  yearControl = new FormControl();
  myControl1 = new FormControl();
  autoCompleteControl = new FormControl();
  filteredAutoCompleteOptions: Observable<string[]>;
  salesmenGridApi;
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  bonuses = {
    totalBonusAB: 0,
    totalBonusA: 0,
    totalBonusB: 0
  };
  remarkControl = new FormControl();

  updateBonus(): void {
    this.bonuses.totalBonusA = 0;
    this.ordersRowData.forEach(element => {
      this.bonuses.totalBonusA += parseInt(element.bonus, 0);
    });
    this.bonuses.totalBonusB = 0;
    this.performanceRowData.forEach(x => {
      this.bonuses.totalBonusB += Number(x.bonus);
    });
    this.bonuses.totalBonusAB = this.bonuses.totalBonusA + this.bonuses.totalBonusB;
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

  postBonusComputation(bonusComputation: BonusComputation): void {
    this.bonusComputationService.postBonusComputation(bonusComputation)
      .subscribe(res => {
          console.log(res);
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  putPerformanceRecord(id: string, performanceRecord: PerformanceRecord): Observable<PerformanceRecord> {
    return this.performanceRecordService.putPerformanceRecord(id, performanceRecord);
  }

  postPerformanceRecord(performanceRecord: PerformanceRecord): Observable<PerformanceRecord> {
    return this.performanceRecordService.postPeformanceRecord(performanceRecord);
  }

  getPerformanceRecordsBySidAndYear(sid: number, year): Observable<PerformanceRecord[]> {
    return this.performanceRecordService.getPerformanceRecordsBySidAndYear(sid, year);
  }

  getCurrentBonusComputation(): void{
    this.bonusComputationService.getBonusComputation(this.selectedSalesman._id, this.yearControl.value)
      .subscribe(bonusComputation => {
        this.currentBonusComputation = bonusComputation[0];
        if (this.currentBonusComputation === undefined){
          this.remarkControl.setValue('');
        }
        this.remarkControl.setValue(this.currentBonusComputation.remarks);
        console.log(this.currentBonusComputation);
      });
  }
  onSelectionChanged(event): void {
    const selectedRows = event.api.getSelectedRows();
    if (selectedRows.length === 1) {
      Object.entries(selectedRows[0]).forEach(([key, value]) => {
        this.selectedSalesman[key] = value;
      });
      this.getCurrentBonusComputation();
      this.setOrdersAndPerformances();
    } else {
      console.log('There was nothing to be selected!');
    }
  }

  onYearChange(event: any): void {
    this.setOrdersAndPerformances();
  }

  getSalesOrders(): Observable<SalesOrder[]> {
    return this.salesOrderService
      .getSalesOrdersBySidAndYear(this.selectedSalesman._id, this.yearControl.value);
  }

  getPerformanceRecords(): Observable<PerformanceRecord[]> {
    return this.performanceRecordService
      .getPerformanceRecordsBySidAndYear(this.selectedSalesman._id, this.yearControl.value);
  }

  setOrdersAndPerformances(): void {
    this.getSalesOrders().subscribe(salesOrders => this.getPerformanceRecords().subscribe(performances => {
      if (salesOrders.length > 0) {
        this.ordersRowData = salesOrders;
        if (performances.length !== 0) {
          this.performanceRowData = performances;
        } else {
          this.performanceRowData = this.performanceRowDataEmpty;
        }
        this.updateBonus();
      } else {
        this.ordersRowData = [];
        this.performanceRowData = [];
      }
    }), (err) => {
    });
  }

  acceptBonusComputationProposal(): void {
    if (this.currentUser.role === 2){
      this.currentBonusComputation.status = 2;
      this.bonusComputationService.putBonusComputation(this.currentBonusComputation._id, this.currentBonusComputation).subscribe(_ => {
        console.log('The Bonus Computation proposal was successfully accepted!');
      });
    } else {
      console.log('The current user`s role is not known ');
    }
    }

  rejectBonusComputationProposal(): void {
    if (this.currentUser.role === 2){
        this.currentBonusComputation.status = 0;
        this.bonusComputationService.putBonusComputation(this.currentBonusComputation._id, this.currentBonusComputation).subscribe(_ => {
          console.log('The Bonus Computation proposal was successfully reject!');
        });
      } else {
        console.log('The current user`s role is not known ');
      }
  }
  acceptBonusComputation(): void {
    if (this.currentUser.role === 3) {
      this.currentBonusComputation.status = 3;
      this.bonusComputationService.putBonusComputation(this.currentBonusComputation._id, this.currentBonusComputation).subscribe(_ => {
        console.log('Bonus Computation was successfully accepted!');
      });
    } else {
      console.log('The current user`s role is not known ');
    }
  }

  rejectBonusComputation(): void {
    if (this.currentUser.role === 3) {
      this.currentBonusComputation.status = 1;
      this.bonusComputationService.putBonusComputation(this.currentBonusComputation._id, this.currentBonusComputation).subscribe(_ => {
        console.log('Bonus Computation was successfully rejected!');
      });
    } else {
      console.log('The current user`s role is not known ');
    }
  }

  updateExistingBonusComputation(bonusComputation: BonusComputation): void {
    const changedSalesOrders: Observable<SalesOrder>[] = [];
    this.ordersRowData.forEach((order) => {
      changedSalesOrders.push(this.salesOrderService.putSalesOrder(order._id, order));
    });
    const changedPerformanceRecords: Observable<PerformanceRecord>[] = [];
    this.performanceRowData.map(performance => {
      changedPerformanceRecords
        .push(this.putPerformanceRecord(performance._id, performance));
    });
    zip(forkJoin(changedSalesOrders), forkJoin(changedPerformanceRecords)).subscribe(_ => {
      this.bonusComputationService.putBonusComputation(bonusComputation._id, bonusComputation)
        .subscribe(() => console.log('Updated'));
    });
  }

  export(): void {
    this.bonusComputationService.getBonusComputation(this.selectedSalesman._id, this.yearControl.value)
      .subscribe(b => {
        let bonusComputation: BonusComputation = {} as BonusComputation;
        if (b[0] !== undefined) {
          bonusComputation = {
            _id: b[0]._id, sid: b[0].sid, year: b[0].year,
            value: b[0].value, salesOrders: b[0].salesOrders, performanceRecords: b[0].performanceRecords,
            remarks: this.remarkControl.value, status: 1
          };
          this.updateExistingBonusComputation(bonusComputation);
        } else {
          bonusComputation = {
            _id: '', sid: this.selectedSalesman._id, year: parseInt(this.yearControl.value, 10),
            value: this.bonuses.totalBonusAB, salesOrders: [], performanceRecords: [], remarks: this.remarkControl.value, status: 1
          };
          this.ordersRowData.forEach((order) => {
            bonusComputation.salesOrders.push(order._id);
          });
          const newPerformanceRecords: Observable<PerformanceRecord>[] = this.createNewPerformanceRecords();
          forkJoin(newPerformanceRecords).subscribe(_ => {
            this.getPerformanceRecordsBySidAndYear(this.selectedSalesman._id, this.yearControl.value)
              .subscribe(performanceRecords => {
                performanceRecords.forEach(performanceRecord => {
                  bonusComputation.performanceRecords.push(performanceRecord._id);
                });
                this.bonusComputationService.postBonusComputation(bonusComputation).subscribe();
              });
          });
        }
      });
  }

  createNewPerformanceRecords(): Observable<PerformanceRecord>[] {
    const newPerformanceRecords: Observable<PerformanceRecord>[] = [];
    this.performanceRowData.map((performance) => {
      performance.sid = this.selectedSalesman._id;
      performance.year = this.yearControl.value;
      newPerformanceRecords.push(this.performanceRecordService.postPeformanceRecord(performance));
    });
    return newPerformanceRecords;
  }

  getCurrentUser(): void {
    this.userService.getOwnUser().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser);
      this.setSalesmanTable();
    });
  }

  getSalesman(id: string): void {
    this.salesmanService.getSalesman(id).subscribe(salesman => {
      this.salesmenRowData = [salesman];
    });
  }

  setSalesmanAutoComplete(): void {
    this.salesmenRowData.forEach((element) => {
      this.options.push(element.firstName + '' + element.lastName);
    });
    this.filteredAutoCompleteOptions = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  setSalesmanTable(): void {
    // if admin fetch all salesman and populate table
    if (this.currentUser.role === 0 || this.currentUser.role === 1 || this.currentUser.role === 2) {
      this.getSalesmen();
      this.setSalesmanAutoComplete();
    }
      else if (this.currentUser.role === 3) {
      // Salesman view only populate with "own" data
      this.getSalesman('90123');
      this.setSalesmanAutoComplete();
    } else {
      console.log('The current user has no acceptable role');
    }
  }

  ngOnInit(): void {
    this.getCurrentUser();
    // the year stepper is set to the current year
    this.yearControl.setValue(`${new Date().getFullYear()}`);
    // check what role the currently logged in user has
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
    this.salesmenGridApi = params.api;
  }

  onSelFunc(option): void {
    filterValue = option;
    this.salesmenGridApi.onFilterChanged();
  }

  clearInput(): void {
    this.autoCompleteControl.setValue('');
    filterValue = '';
    this.salesmenGridApi.onFilterChanged();
  }

  checkInput(): void {
    filterValue = this.autoCompleteControl.value;
    this.salesmenGridApi.onFilterChanged();
  }

  isExternalFilterPresent(): boolean {
    return filterValue !== '';
  }

  doesExternalFilterPass(node): boolean {
    return node.data.firstName.toLowerCase().includes(filterValue.toLowerCase());
  }
}

let filterValue = '';
