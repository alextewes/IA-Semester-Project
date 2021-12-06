import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-bonus-computation-page',
  templateUrl: './bonus-computation-page.component.html',
  styleUrls: ['./bonus-computation-page.component.css']
})
export class BonusComputationPageComponent implements OnInit {
  years = 2030;
  baseColumnDefs: ColDef[] = [
    { field: 'sid', headerName: 'SID', sortable: true, flex: 1 },
    { field: 'firstName', headerName: 'First Name', sortable: true, flex: 1 },
    { field: 'lastName', headerName: 'Last Name', sortable: true, flex: 1 },
    { field: 'dob', headerName: 'Date of Birth', sortable: true, flex: 1 },
    { field: 'experience', headerName: 'Experience', sortable: true, flex: 1 }
  ];
  baseRowData = [
    { sid: 1, firstName: 'John', lastName: 'Smith' },
    { sid: 2, firstName: 'Bruce', lastName: 'Wayne' },
    { sid: 3, firstName: 'Miles', lastName: 'Morales' }
  ];

  ordersColumnDefs: ColDef[] = [
    { field: 'productName', headerName: 'Name of Product', sortable: true, flex: 1 },
    { field: 'client', headerName: 'Client', sortable: true, flex: 1 },
    { field: 'clientRanking', headerName: 'Client Ranking', sortable: true, flex: 1 },
    { field: 'items', headerName: 'Items', sortable: true, flex: 1 },
    { field: 'bonus', headerName: 'Bonus', sortable: true, editable: true, flex: 1 },
  ];
  ordersRowData = [
    {productName: 'HooverGo', client: 'Telekom', clientRanking: 'excellent', items: 20700, bonus: 200 },
    {productName: ' ', client: 'Mayer Werft AG', clientRanking: 'very good', items: 10, bonus: 500 },
    {productName: ' ', client: '', clientRanking: '', Items: 0, Bonus: 0 },
    {productName: 'HooverClean ', client: 'Germania GmbH', clientRanking: 'good', items: 10, bonus: 200 },
  ];
  socialPerformanceColumnDefs: ColDef[] = [
    { field: 'category', headerName: ' Category', sortable: true, flex: 1 },
    { field: 'targetValue', headerName: 'Target Value', sortable: true, editable: true, flex: 1 },
    { field: 'actualValue', headerName: 'Actual Value', sortable: true, editable: true, flex: 1 },
    { field: 'bonus', headerName: 'Bonus', sortable: true, editable: true, flex: 1 },
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
  options: string[] = ['John Smith', 'Bruce Wane', 'Miles Morales'];
  filteredOptions: Observable<string[]>;

  @Input() totalBonusAB: number;
  @Output() totalBonusABChange = new EventEmitter<number>();

  method(): void{
    let totalBonusB = 0;
    this.ordersRowData.forEach(element => {
      totalBonusB = +  element;
    });
  }
  constructor() { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
