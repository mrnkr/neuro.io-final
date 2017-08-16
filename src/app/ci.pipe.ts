import { Pipe, PipeTransform } from '@angular/core';
/*
 * Turns uruguayan IDs into a friendly number to display
 * It was necessary to name it in spanish, dont hate on me
*/
@Pipe({name: 'cedula'})
export class CedulaPipe implements PipeTransform {
  transform(value: string): string {
    if (this.checkValue(value)) {
      // If the string corresponds to an 8 digit number transform it
      return value.charAt(0) + '.' + value.substr(1, 3) + '.' + value.substr(4, 3) + '-' + value.charAt(value.length - 1);
    }

    if (value !== undefined) {
      // If the string is not an 8 digit number then return such string without modification
      return value.replace(/\./g, '').replace(/-/g, '');
    }

    return '';
  }

  checkValue(value: string): boolean {
    if (value === undefined) {
      return false;
    }

    if (value.length !== 8) {
      return false;
    }

    if (isNaN(parseInt(value, 10))) {
      return false;
    }

    if (value.includes('.') || value.includes('-') || value.includes(' ')) {
      return false;
    }

    return true;
  }
}
