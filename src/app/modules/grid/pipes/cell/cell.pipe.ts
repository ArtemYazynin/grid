import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { YesNoPipe } from '../yes-no/yes-no.pipe';

@Pipe({
  name: 'cell',
  pure: true
})
export class CellPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string, @Inject('dateFormat') private DATE_FORMAT,
    private datePipe: DatePipe,
    private yesNoPipe: YesNoPipe) {

  }
  transform(value: any, args?: any): any {

    if (this.isComplexType(value)) {
      let result;
      if (value instanceof Date) {
        result = this.datePipe.transform(value, this.DATE_FORMAT);
      } else {
        result = value;
      }
      return result;
    } else if ((typeof value) === 'boolean') {
      return this.yesNoPipe.transform(value);
    }
    return value;
  }

  private isComplexType(value: any) {
    return (typeof value) === 'object' ? true : false;
  }
}
