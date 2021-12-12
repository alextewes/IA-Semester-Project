import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ColDef} from 'ag-grid-community';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {BonusComputationService} from '../../services/bonus-computation.service';
import {BonusComputation} from '../../models/BonusComputation.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-bonus-computation-page',
  templateUrl: './bonus-computation-page.component.html',
  styleUrls: ['./bonus-computation-page.component.css']
})
export class BonusComputationPageComponent implements OnInit {
  public bonusComputations: BonusComputation[];

  constructor(private bonusComputationService: BonusComputationService) {
  }

  years = 2030;
  baseColumnDefs: ColDef[] = [
    {field: 'sid', headerName: 'SID', sortable: true, flex: 1},
    {field: 'firstName', headerName: 'First Name', sortable: true, flex: 1},
    {field: 'lastName', headerName: 'Last Name', sortable: true, flex: 1},
    {field: 'dob', headerName: 'Date of Birth', sortable: true, flex: 1},
    {field: 'experience', headerName: 'Experience', sortable: true, flex: 1}
  ];
  baseRowData = [
    {sid: 1, firstName: 'John', lastName: 'Smith'},
    {sid: 2, firstName: 'Bruce', lastName: 'Wayne'},
    {sid: 3, firstName: 'Miles', lastName: 'Morales'}
  ];

  ordersColumnDefs: ColDef[] = [
    {field: 'productName', headerName: 'Name of Product', sortable: true, flex: 1},
    {field: 'client', headerName: 'Client', sortable: true, flex: 1},
    {field: 'clientRanking', headerName: 'Client Ranking', sortable: true, flex: 1},
    {field: 'items', headerName: 'Items', sortable: true, flex: 1},
    {field: 'bonus', headerName: 'Bonus', sortable: true, editable: true, flex: 1},
  ];
  ordersRowData = [
    {productName: 'HooverGo', client: 'Telekom', clientRanking: 'excellent', items: 20700, bonus: 200},
    {productName: ' ', client: 'Mayer Werft AG', clientRanking: 'very good', items: 10, bonus: 500},
    {productName: ' ', client: '', clientRanking: '', Items: 0, Bonus: 0},
    {productName: 'HooverClean ', client: 'Germania GmbH', clientRanking: 'good', items: 10, bonus: 200},
  ];
  socialPerformanceColumnDefs: ColDef[] = [
    {field: 'category', headerName: ' Category', sortable: true, flex: 1},
    {field: 'targetValue', headerName: 'Target Value', sortable: true, editable: true, flex: 1},
    {field: 'actualValue', headerName: 'Actual Value', sortable: true, editable: true, flex: 1},
    {field: 'bonus', headerName: 'Bonus', sortable: true, editable: true, flex: 1},
  ];
  socialPerformanceRowData = [
    {category: 'Leadership Competence', targetValue: 4, actualValue: 3, bonus: 20},
    {category: 'Openness to Employee', targetValue: 4, actualValue: 3, bonus: 20},
    {category: 'Social Behaviour to Employee', targetValue: 4, actualValue: 3, bonus: 100},
    {category: 'Attitude towards Client', targetValue: 4, actualValue: 3, bonus: 20},
    {category: 'Communication Skills', targetValue: 4, actualValue: 3, bonus: 50},
    {category: 'Integrity to Company', targetValue: 4, actualValue: 3, bonus: 20}
  ];
  myControl = new FormControl();
  options: string[];

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
    this.socialPerformanceRowData.forEach(x => {
      this.bonuses.totalBonusB = +x.bonus;
    });
    this.bonuses.totalBonusAB = this.bonuses.totalBonusA + this.bonuses.totalBonusB;
  }

  getBonusComputations(): void {
    this.bonusComputationService.getBonusComputations()
      .subscribe((data: BonusComputation[]) => {
          return this.bonusComputations = data;
        },
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.baseRowData.forEach((element) => {
      this.options.push(element.firstName + '' + element.lastName);
    });

    // this.method("");
    this.getBonusComputations();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
