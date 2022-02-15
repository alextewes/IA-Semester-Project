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

import {performanceRowDataEmpty, salesmenColumnDefs, performanceColumnDefs, ordersColumnDefs} from './GridDefinitions';
let filterValue = '';

@Component({
  selector: 'app-bonus-computation-page',
  templateUrl: './bonus-computation-page.component.html',
  styleUrls: ['./bonus-computation-page.component.css']
})
export class BonusComputationPageComponent implements OnInit {
  public bonusComputations: BonusComputation[];
  public rowSelection = 'single';
  remarkControl = new FormControl();
  @Input() public currentUser: User = {} as User;
  @Input() selectedSalesman: Salesman = {} as Salesman;
  public currentBonusComputation: BonusComputation;
  private performanceGridApi: any;

  constructor(private bonusComputationService: BonusComputationService,
              private salesmanService: SalesmanService,
              private salesOrderService: SalesorderService,
              private performanceRecordService: PerformanceRecordService,
              private userService: UserService) {
  }

  salesmenColumnDefs: ColDef[] = salesmenColumnDefs;
  salesmenRowData = [];
  ordersColumnDefs: ColDef[] = ordersColumnDefs;
  ordersRowData = [];
  performanceColumnDefs: ColDef[] = performanceColumnDefs;
  performanceRowData = [];
  yearControl = new FormControl();
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

  calculateBonus(): void {
    this.performanceRowData.forEach((performance) => {
      if (performance.actualValue !== 0 && performance.targetValue !== 0) {
        const targetActualRatio = performance.actualValue / performance.targetValue;
        if (targetActualRatio <= 0) {
          performance.bonus = 0;
        } else {
          performance.bonus = Number(targetActualRatio.toFixed(2)) * this.goalDescriptionToValue(performance.goalDesc);
        }
      } else {
        performance.bonus = 0;
      }
    });
    const itemsToUpdate: any[] = [];
    this.performanceGridApi.forEachNodeAfterFilterAndSort((rowNode) => {
      const data = rowNode.data;
      itemsToUpdate.push(data);
    });
    this.performanceGridApi.applyTransaction({update: itemsToUpdate});
  }

  goalDescriptionToValue(description: string): number {
    switch (description) {
      case 'Leadership Competence':
        return 300;
      case 'Openness to Employee':
        return 100;
      case 'Social Behaviour to Employee':
        return 200;
      case 'Attitude towards Client':
        return 300;
      case 'Communication Skills':
        return 300;
      case 'Integrity to Company':
        return 200;
      default:
        return 100;
    }
  }

  updateBonus(): void {
    this.calculateBonus();
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

  onSelectionChanged(event): void {
    this.handleSelectionOrYearInputChange();
  }

  handleSelectionOrYearInputChange(): void{
    this.currentBonusComputation = undefined;
    this.remarkControl.setValue('');
    const selectedRows = this.salesmenGridApi.getSelectedRows();
    if (selectedRows.length === 1) {
      Object.entries(selectedRows[0]).forEach(([key, value]) => {
        this.selectedSalesman[key] = value;
      });
      this.bonusComputationService
        .getBonusComputation(this.selectedSalesman._id, this.yearControl.value)
        .subscribe(bonusComputation => {
          this.currentBonusComputation = bonusComputation[0];
          this.remarkControl.setValue(this.currentBonusComputation.remarks);
          this.salesOrderService.getSalesOrdersBySidAndYear(this.currentBonusComputation.sid, this.currentBonusComputation.year)
            .subscribe(salesorders => {
              this.ordersRowData = salesorders;
              this.performanceRecordService
                .getPerformanceRecordsBySidAndYear(this.currentBonusComputation.sid, this.currentBonusComputation.year)
                .subscribe(performancerecords => {
                  this.performanceRowData = performancerecords;
                  this.updateBonus();
                }, () => {
                  this.performanceRowData = [];
                });
            }, () => {
              this.ordersRowData = [];
            });
        }, (_) => {
          this.getSalesOrders()
            .subscribe(salesOrders => {
              if (salesOrders.length > 0) {
                this.ordersRowData = salesOrders;
                this.getPerformanceRecords().subscribe(performances => {
                  if (performances.length !== 0) {
                    this.performanceRowData = performances;
                  } else {
                    this.performanceRowData = JSON.parse(JSON.stringify(performanceRowDataEmpty));
                    this.updateBonus();
                  }
                }, () => {
                  this.performanceRowData = JSON.parse(JSON.stringify(performanceRowDataEmpty));
                  this.updateBonus();
                });
              }
              else{
                this.ordersRowData = [];
                this.performanceRowData = [];
                this.updateBonus();
              }
            }, () => {
              this.ordersRowData = [];
              this.performanceRowData = [];
              this.updateBonus();
            }, () => {
              this.updateBonus();
            });
        });
    }
  }
  onYearInputChanged(event: any): void {
    this.handleSelectionOrYearInputChange();
  }

  getSalesOrders(): Observable<SalesOrder[]> {
    return this.salesOrderService
      .getSalesOrdersBySidAndYear(this.selectedSalesman._id, this.yearControl.value);
  }

  getPerformanceRecords(): Observable<PerformanceRecord[]> {
    return this.performanceRecordService
      .getPerformanceRecordsBySidAndYear(this.selectedSalesman._id, this.yearControl.value);
  }

  acceptBonusComputationProposal(): void {
    if (this.currentUser.role === 2) {
      this.currentBonusComputation.status = 2;
      this.updateExistingBonusComputation(this.currentBonusComputation);
    } else {
      console.log('The current user`s role is not known ');
    }
  }

  rejectBonusComputationProposal(): void {
    if (this.currentUser.role === 2) {
      this.currentBonusComputation.status = 0;
      this.updateExistingBonusComputation(this.currentBonusComputation);
    } else {
      console.log('The current user`s role is not known ');
    }
  }

  acceptBonusComputation(): void {
    if (this.currentUser.role === 3) {
      this.currentBonusComputation.status = 3;
      this.bonusComputationService
        .putBonusComputation(this.currentBonusComputation._id, this.currentBonusComputation)
        .subscribe(_ => {
          console.log('Bonus Computation was successfully accepted!');
        });
    } else {
      console.log('The current user`s role is not known ');
    }
  }

  rejectBonusComputation(): void {
    if (this.currentUser.role === 3) {
      this.currentBonusComputation.status = 1;
      this.bonusComputationService
        .putBonusComputation(this.currentBonusComputation._id, this.currentBonusComputation)
        .subscribe(_ => {
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
    if (this.currentUser.role  < 2){
      bonusComputation.remarks = this.remarkControl.value;
    }
    bonusComputation.value = this.bonuses.totalBonusAB;
    this.updateBonus();
    zip(forkJoin(changedSalesOrders), forkJoin(changedPerformanceRecords)).subscribe(_ => {
      this.bonusComputationService.putBonusComputation(bonusComputation._id, bonusComputation)
        .subscribe(() => console.log('Updated'));
    });
  }

  export(): void {
    let bonusComputation: BonusComputation = {} as BonusComputation;
    this.bonusComputationService.getBonusComputation(this.selectedSalesman._id, this.yearControl.value)
      .subscribe(b => {
          bonusComputation = {
            _id: b[0]._id, sid: b[0].sid, year: b[0].year,
            value: b[0].value, salesOrders: b[0].salesOrders, performanceRecords: b[0].performanceRecords,
            remarks: this.remarkControl.value, status: 1
          };
          this.updateExistingBonusComputation(bonusComputation);
      }, () => {
        bonusComputation = {
          _id: '',
          sid: this.selectedSalesman._id,
          year: parseInt(this.yearControl.value, 10),
          value: this.bonuses.totalBonusAB,
          salesOrders: [],
          performanceRecords: [],
          remarks: this.remarkControl.value,
          status: 1
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
              this.currentBonusComputation = bonusComputation;
            });
        });
      }, () => {
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
    } else if (this.currentUser.role === 3) {
      // Salesman view only populate with "own" data
      this.getSalesman('90123');
      this.setSalesmanAutoComplete();
    } else {
      console.log('The current user has no acceptable role');
    }
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.yearControl.setValue(`${new Date().getFullYear()}`);
  }

  private _filter(value: string): string[] {
    const fValue = value.toLowerCase();
    const filteredSalesmen = this.salesmenRowData.filter(option => {
      return (option.firstName + ' ' + option.lastName).toLowerCase().includes(fValue);
    });
    return filteredSalesmen.map(salesman => salesman.firstName);
  }

  onSalesmanGridReady(params): void {
    this.salesmenGridApi = params.api;
  }

  onPerformanceGridReady(params): void {
    this.performanceGridApi = params.api;
  }

  onAutocompleteSelectionChanged(option): void {
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

