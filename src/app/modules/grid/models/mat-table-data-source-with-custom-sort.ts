import { MatTableDataSource } from '@angular/material/table';
import { MatSort, SortDirection } from '@angular/material/sort';
import { GroupRow } from './group-row.model';

export class MatTableDataSourceWithCustomSort<T> extends MatTableDataSource<T> {
    _compareFn = new Intl.Collator('pl', { sensitivity: 'base', numeric: true }).compare;

    sortingDataAccessor = (row: any, systemname: string) => {
        if (row.groupName) {
            return row.initial;
        } else {
            switch (typeof row[systemname].value) {
                case 'string':
                    return (row[systemname].value as string).toLowerCase();
                default:
                    return row[systemname].value;
            }
        }
    };

    sortData = (data: any[], sort: MatSort) => {
        const active = sort.active;
        const direction = sort.direction;
        if (active || direction) {
            const groups = data.filter(x => x.groupName) as GroupRow[];
            const sortCompare = this.sortCompareFn(active, direction);
            if (groups) {
                let result = [];
                groups.forEach(group => {
                    const temp = data.filter(row => {
                        if (!row[group.groupingProperty]) { return false; }
                        return row[group.groupingProperty].value === group.groupingValue;
                    });
                    const groupedResult = temp.sort(sortCompare);
                    groupedResult.unshift(group);
                    result = [...result, ...groupedResult];
                });
                return result;
            }
            return data.sort(sortCompare);
        } else {
            const groups = data.filter(x => x.groupName) as GroupRow[];
            if (groups) {
                let result = [];
                groups.forEach(group => {
                    const temp = data.filter(row => {
                        if (!row[group.groupingProperty]) { return false; }
                        return row[group.groupingProperty].value === group.groupingValue;
                    });
                    temp.unshift(group);
                    result = [...result, ...temp];
                });
                return result;
            }
            return data;
        }
    }

    filterPredicate = (data: any, filter: string) => {
        const getPropertyValue = () => {
            switch (typeof data[property].value) {
                case 'boolean':
                    return filterParams[1] === 'true';

                default:
                    return filterParams[1];
            }
        };
        const filterParams: string[] = filter.split(';');
        const property = filterParams[0];
        if (!data[property]) { return true; }
        const propertyValue = getPropertyValue();
        const isVisible = filterParams[2] === 'true';
        if (data[property].value === propertyValue) {
            return isVisible;
        }
        const group = this.data.find(x => {
            if (x instanceof GroupRow) {
                return x.groupingProperty === property && x.groupingValue !== propertyValue;
            }
        }) as unknown as GroupRow;
        return group.$isExpanded.value;
    };


    private sortCompareFn(active: string, direction: SortDirection) {
        return (a, b) => {
            const valueA = this.sortingDataAccessor(a, active);
            const valueB = this.sortingDataAccessor(b, active);

            const comparatorResult = this._compareFn(<string>valueA, <string>valueB);

            return comparatorResult * (direction == 'asc' ? 1 : -1);
        }
    }
}