import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { GridComponent, GridDataResult, PageChangeEvent, slice } from "@progress/kendo-angular-grid";
import { SortDescriptor, process, State, FilterDescriptor, CompositeFilterDescriptor, GroupDescriptor, AggregateDescriptor } from "@progress/kendo-data-query";
import { ProductService } from "../product.service";
import { products } from "../data.products";
import { employees, colSettings } from "../data-v2.products";
import { aggregateBy } from '@progress/kendo-data-query';
import { ColumnSettings, FilterType, GridSettings } from '../grid-settings.interface';
import { StatePersistingService } from '../state-persisting.service';
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
declare var $ : any;
declare var kendo: any;

import '@progress/kendo-ui';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['../app.component.scss','../pdf-styles.css'],
  providers: [ProductService, StatePersistingService],
  encapsulation: ViewEncapsulation.None
})

export class MyGridComponent {
    title = 'Attendance Report- Wurknow';
    @ViewChild('gridContainer') kGrid!: ElementRef;
    public gridItems?: GridDataResult;
    public pageSize: number = 16;
    public skip: number = 0;
    public sortDescriptor: SortDescriptor[] = [];
    public filterDescriptor:CompositeFilterDescriptor = {
      logic: "and",
      filters: [],
    };
    
    public isSum = false;
    public isAvg = false;
    public isCount = false;
    public show = false;
    public selectedAgg="";

    public aggregates: AggregateDescriptor[] = [
      {field: 'country', aggregate: 'count'},
      {field: 'job_title', aggregate: 'count'},
      {field: 'rating', aggregate: 'average'}
    ];

    public availableAggregates = {
        numeric: [{ aggregate: "average" }, { aggregate: "count" }, { aggregate: "max" }, { aggregate: "min" }, { aggregate: "sum" }],
        date: [{ aggregate: "count" }, { aggregate: "max" }, { aggregate: "min" }],
        string: [{ aggregate: "count" }]
      };

    public aggregatesOpts = [
      { display: 'Average', text: 'avg', selected: false , type: ["numeric"]},
      { display: 'Sum', text: 'sum', selected: false , type: ["numeric"]},
      { display: 'Count', text: 'count', selected: false , type: ["numeric", "string"] }
    ];
    public groups: GroupDescriptor[] = [];
  
    public gridSettings: GridSettings={
        state:{
          filter: this.filterDescriptor,
          group: [],
          skip: 0,
          take: 16
        },
        gridData: 
        process(employees, {
          skip: 0,
          take: 5,
    
          // Initial filter descriptor
          filter: {
            logic: 'and',
            filters: []
          }
        }),
        columnsConfig: colSettings        
      };

    public paperSize: string = "A2";
    public imageUrl = `url('data:image/jpeg;base64,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`
    public currentCategoryName?: string;
    constructor(private service: ProductService, public persistingService: StatePersistingService) {
      const gridSettings: GridSettings = this.persistingService.get('grid2Settings');

      this.allData = this.allData.bind(this);
      
      if (gridSettings !== null) {
        var savedList = JSON.stringify(gridSettings.columnsConfig, getCircularReplacer())
        var inputList = JSON.stringify(this.gridSettings.columnsConfig, getCircularReplacer());

        if(savedList == inputList)
          this.gridSettings = this.mapGridSettings(gridSettings);
        else{
          gridSettings.columnsConfig = this.gridSettings.columnsConfig;
          this.gridSettings = this.mapGridSettings(gridSettings, true);
        }
      }
    }

    public allData(): ExcelExportData {
      const result: ExcelExportData = {
        data: process(employees, {
          group: this.gridSettings.state.group,
          sort: this.gridSettings.state.sort
        }).data,
        group: this.gridSettings.state.group,
      };
  
      return result;
    }
    
    public mapGridSettings(gridSettings: GridSettings, forceNewColumns: boolean = false): GridSettings {
      const state = gridSettings.state;
      this.mapDateFilter(state.filter);
  
      return {
        state,
        columnsConfig: forceNewColumns ? colSettings : gridSettings.columnsConfig,
        gridData: process(employees, state)
      };
    }
    
    private mapDateFilter = (descriptor: any) => {
      const filters = descriptor.filters || [];
  
      filters.forEach((filter: CompositeFilterDescriptor) => {
          if (filter.filters) {
              this.mapDateFilter(filter);
          }
      });
    }
  
    public pageChange(event: PageChangeEvent): void {
      this.skip = event.skip;
      this.loadGridItems();
    }
  
    private loadGridItems(): void {
      this.service.getProducts(
        this.skip,
        this.pageSize,
        this.sortDescriptor,
        this.filterDescriptor,
        this.groups
      ).subscribe(x =>{
        this.gridItems = x;
      });
    }
  
    public handleSortChange(descriptor: SortDescriptor[]): void {
      this.sortDescriptor = descriptor;
      this.loadGridItems();
    }
  
    handleFilterChange(descriptor: CompositeFilterDescriptor): void{
      this.filterDescriptor = descriptor;
      this.loadGridItems();
    }
    
    public groupChange(groups: GroupDescriptor[]): void {
      if(groups.length > 0)
        groups.forEach(grp => {
          grp.aggregates =  this.aggregates;
        }); 
      this.groups = groups;
      this.loadGridItems();
    }
    
    private saveGrid(): void {
      const gridConfig = {
        columnsConfig: this.gridSettings.columnsConfig,
        state: this.gridSettings.state
      };
  
      this.persistingService.set('grid2Settings', gridConfig);
    }
    
    public dataStateChange(state: State): void {
      if (state && state.group) {
        state.group.map((group) => (group.aggregates = this.aggregates));
      }
 
      this.gridSettings.state = state;
      this.gridSettings.gridData = process(employees, state);
      this.saveGrid();
    }

    public get savedStateExists(): boolean {
      return !!this.persistingService.get("gridSettings");
    }
    public getFilterData(filter: string){
      if(filter == 'number')
        return this.availableAggregates.numeric;
      else if(filter == 'date')
        return this.availableAggregates.date;
      else
        return this.availableAggregates.string.map(x => { return x.aggregate});
    }

    public saveGridSettings(grid: GridComponent): void {
      const columns = grid.columns;
  
      const gridConfig = {
        state: this.gridSettings.state,
        columnsConfig: columns.toArray().map(item => {
          return Object.keys(item)
            .filter(propName => !propName.toLowerCase()
              .includes('template'))
              .reduce((acc, curr: any) => ({...acc, ...{[curr]: (item as any)[curr]}}), <ColumnSettings> {});
        })
      };
      
      this.persistingService.set('gridSettings', gridConfig);
    }    
    
    public calcSum(col: string): number {
      const sum = this.gridSettings.gridData?.data.reduce((acc, item: any) => {
        acc += Number(item[`${col}`]);
        return acc;
      }, 0);

      return sum;
    }

    public calcAvg(col: string): number {
      const sum = this.calcSum(col);
      const dividend =  this.gridSettings.gridData ? this.gridSettings.gridData.data.length : 1;
      const avg = sum / dividend;
      return Math.round(avg);
    }

    public calcCount(col: string): number{
      return this.gridSettings.gridData? this.gridSettings.gridData.data.length : 0;
    }

    public onToggle(): void {
      this.show = !this.show;
    }
    public onCheckBoxChange(agg: string, event: any) {
      // this.selectedAgg = agg;
      var checked = false;
      if(event)
        checked = event.target.checked;
        var select = this.aggregatesOpts.find(x => x.text == agg);
        if(select){
          if(checked)
            select.selected = true;
          else  
            select.selected = false;
        }
    }

    public apply() {
      // this.onToggle();

      this.aggregatesOpts.forEach(opt => {
          if(opt.text =='sum')
              this.isSum = opt.selected;
          if(opt.text =='avg')
              this.isAvg = opt.selected;
          if(opt.text =='count')
              this.isCount = opt.selected;
      });


    }

    public selectAll() {
      this.aggregatesOpts.map(item => (item.selected = true));
      this.isAvg = true;
      this.isSum = true;
      this.isCount = true;
    }

    public removeAll() {
      // this.onToggle();
      this.aggregatesOpts.map(agg => (agg.selected = false));
    this.isAvg = false;
    this.isSum = false;
    this.isCount = false;
  }

  checkAggregateOption(aggregate: {text: string , type: string[]}, filter?: FilterType){
    return aggregate.type.some(x => x == filter);
  }
}
  
  
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: object | null) => {
      if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
              return;
          }
          seen.add(value);
      }
      return value;
  };
};
