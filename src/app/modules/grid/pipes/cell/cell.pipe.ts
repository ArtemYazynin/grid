import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { YesNoPipe } from '../yes-no/yes-no.pipe';
import { Cell } from '../../models/cell.model';
@Pipe({
  name: 'cell',
  pure: true
})
export class CellPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string, @Inject('dateFormat') private DATE_FORMAT,
    private datePipe: DatePipe,
    private yesNoPipe: YesNoPipe) {

  }
  transform(cellMetaData: Cell<number | string | boolean | Date>, args?: any): any {

    if (this.isComplexType(cellMetaData.value)) {
      let result;
      if (cellMetaData.value instanceof Date) {
        result = this.datePipe.transform(cellMetaData.value, this.DATE_FORMAT);
      } else {
        result = cellMetaData.value;
      }
      return result;
    } else if ((typeof cellMetaData.value) === 'boolean') {
      return this.yesNoPipe.transform(<boolean>cellMetaData.value);
    }
    return cellMetaData.value;
  }

  private isComplexType(value: any) {
    return (typeof value) === 'object' ? true : false;
  }
}
