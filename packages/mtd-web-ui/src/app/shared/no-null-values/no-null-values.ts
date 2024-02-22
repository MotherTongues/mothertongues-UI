import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NoNullValuesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'noNullValues'
})
export class NoNullValuesPipe implements PipeTransform {
  /**
   * Removes empty strings from array
   */
  transform(value: Array<string>, ...args) {
    if (value && Array.isArray(value)) {
      return value.filter(x => x !== null && x !== '');
    }
  }
}

@Pipe({
  name: 'filterNullValues'
})
export class FilterNullValuesPipe implements PipeTransform {
  /**
   * Removes empty objects from array
   */
  transform(value: Array<object>) {
    const filtered = value.filter(x => Object.keys(x).every(k => x[k]));
    return filtered;
  }
}

@Pipe({
  name: 'noNullObjectValues'
})
export class NoNullObjectValuesPipe implements PipeTransform {
  /**
   * Removes empty objects from array
   */
  transform(value: Array<any>, ...args): Array<any> {
    if (value && Array.isArray(value)) {
      return value.filter(x => {
        let notEmpty = true;
        Object.keys(x).forEach(k => {
          if (!x[k]) {
            notEmpty = false;
            return notEmpty;
          }
        });
        return notEmpty;
      });
    }
  }
}
