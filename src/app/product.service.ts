import { Injectable } from "@angular/core";
import {
  CompositeFilterDescriptor,
  DataResult,
  FilterDescriptor,
  GroupDescriptor,
  orderBy,
  process,
  SortDescriptor
} from "@progress/kendo-data-query";
import { Observable, of } from "rxjs";
import { products } from "./data.products";
import { employees, colSettings } from "./data-v2.products";

@Injectable()
export class ProductService {
  public getProducts(
    skip: number,
    pageSize: number,
    sortDescriptor: SortDescriptor[],
    filter: CompositeFilterDescriptor,
    group: GroupDescriptor[]
  ): Observable<DataResult> {
    let data;
    if (filter) {
      data = process(orderBy(employees, sortDescriptor), {
        filter: filter,
        group: group
      }).data;
    } else {
      data = orderBy(employees, sortDescriptor);
    }
    return of({
      data: data.slice(skip, skip + pageSize),
      total: data.length
    });
  }
}