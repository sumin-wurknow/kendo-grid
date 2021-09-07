import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridModule, PDFModule, ExcelModule, GridComponent } from '@progress/kendo-angular-grid';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyGridComponent } from "./grid/grid.component";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { FormsModule } from '@angular/forms';
import { MultiCheckFilterComponent } from './dropdownlist-filter.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { PopupModule } from '@progress/kendo-angular-popup';
import { LabelModule } from '@progress/kendo-angular-label';

@NgModule({
  declarations: [
    AppComponent,
    MyGridComponent,
    MultiCheckFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    InputsModule,
    AppRoutingModule,
    GridModule,
    PDFExportModule,
    ExcelModule,
    PDFModule,
    ExcelModule,
    DropDownsModule,
    BrowserAnimationsModule,
    ButtonsModule,
    PopupModule,
    LabelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
