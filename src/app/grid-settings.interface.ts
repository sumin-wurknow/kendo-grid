import { State, DataResult } from "@progress/kendo-data-query";

export interface GridSettings {
    columnsConfig: ColumnSettings[];
    state: State;
    gridData?: DataResult;
}

export interface ColumnSettings {
    field: string;
    title?: string;
    filter?: FilterType;
    format?: string;
    width?: number;
    _width?: number;
    filterable: boolean;
    orderIndex?: number;
    hidden?: boolean;
}

export type FilterType = 'string'|'numeric'|'date'|'boolean';
