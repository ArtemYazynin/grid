import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'cell'
})
export class CellPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string, private datePipe: DatePipe) {

  }
  transform(value: any, args?: any): any {
    let result;
    if (value instanceof Date) {
      result = this.datePipe.transform(value, 'dd.MM.yyyy');
    } else {
      result = value;
    }
    return result;
  }

}
