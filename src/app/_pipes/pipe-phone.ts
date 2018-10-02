import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskPhone'
})

export class MaskPhonePipe implements PipeTransform {
    transform(phone: string): string {
        if (phone.length > 10) {
            return '(' + phone.substr(0, 2) + ') ' + phone.substr(2, 5) + '-' + phone.substr(7, 4);
        } else {
            return '(' + phone.substr(0, 2) + ') ' + phone.substr(2, 4) + '-' + phone.substr(6, 4);
        }
    }
}
