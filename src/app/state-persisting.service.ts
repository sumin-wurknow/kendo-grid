import { GridSettings } from './grid-settings.interface';
import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query';

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

@Injectable()
export class StatePersistingService {
    public get<T>(token: string): T {
        const settings = localStorage.getItem(token);
        return settings ? JSON.parse(settings) : settings;
    }

    public set<T>(token: string, gridConfig: GridSettings): void {
        var json = JSON.stringify(gridConfig,getCircularReplacer());
        localStorage.setItem(token, json);
    }
}
