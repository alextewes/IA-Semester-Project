import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { LoginComponent } from './components/login/login.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { FooterBarComponent } from './components/footer-bar/footer-bar.component';
import { BonusComputationPageComponent } from './pages/bonus-computation-page/bonus-computation-page.component';
import {AgGridModule} from 'ag-grid-angular';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PerformanceRecordsPageComponent } from './pages/performance-records-page/performance-records-page.component';
import { SalesmenPageComponent } from './pages/salesmen-page/salesmen-page.component';
import {SalesmanService} from './services/salesman.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginComponent,
    LandingPageComponent,
    MenuBarComponent,
    ExamplePageComponent,
    NotFoundPageComponent,
    FooterBarComponent,
    BonusComputationPageComponent,
    PerformanceRecordsPageComponent,
    SalesmenPageComponent
  ],
  imports: [
    BrowserModule,
    AppRouting,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    AgGridModule.withComponents([]),
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  providers: [SalesmanService],
  bootstrap: [AppComponent]
})
export class AppModule { }
