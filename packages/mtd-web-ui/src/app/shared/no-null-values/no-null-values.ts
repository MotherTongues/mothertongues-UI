import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NoNullValuesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'noNullValues',
    standalone: false
})
export class NoNullValuesPipe implements PipeTransform {
  /**
   * Removes empty strings from array
   */
  transform(value: Array<string>) {
    return value.filter((x) => x !== null && x !== '');
  }
}

@Pipe({
    name: 'noNullObjectValues',
    standalone: false
})
export class NoNullObjectValuesPipe implements PipeTransform {
  /**
   * Removes empty objects from array
   */
  transform(value: Array<any>) {
    return value.filter((x) => {
      let notEmpty = true;
      Object.keys(x).forEach((k) => {
        if (!x[k]) {
          notEmpty = false;
          return notEmpty;
        }
      });
      return notEmpty;
    });
  }
}
