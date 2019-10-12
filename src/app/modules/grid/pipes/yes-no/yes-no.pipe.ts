import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yesNo',
  pure: true
})
export class YesNoPipe implements PipeTransform {

  transform(value: boolean, args?: any): any {
    return value ? 'Да' : 'Нет'
  }

}
