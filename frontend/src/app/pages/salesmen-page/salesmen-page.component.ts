import {Component, Input, OnInit} from '@angular/core';
import {SalesmanService} from '../../services/salesman.service';
import {Salesman} from '../../models/Salesman.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-salesmen-page',
  templateUrl: './salesmen-page.component.html',
  styleUrls: ['./salesmen-page.component.css']
})
export class SalesmenPageComponent implements OnInit {
  public salesmen: Salesman[];
  public salesman: Salesman;
  @Input() id: string;
  constructor(private salesmanService: SalesmanService) {
  }

  getSalesmen(): void {
    this.salesmanService.getSalesmen()
      .subscribe((data: Salesman[]) => this.salesmen = data,
        (error: HttpErrorResponse) => {
        console.log(error.message);
        });
  }
  getSalesman(id: string): void {
    this.salesmanService.getSalesman(id)
      .subscribe((data: Salesman) => this.salesman = data,
        (error: HttpErrorResponse) => {
          console.log(error.message);
        });
  }
  ngOnInit(): void {
    this.getSalesmen();
  }


}
