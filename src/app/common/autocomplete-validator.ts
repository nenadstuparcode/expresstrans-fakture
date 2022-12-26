import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { IAutoCompleteItem } from '@app/modules/invoice/invoice.interface';

@Directive({
  standalone: true,
  selector: '[isInArray]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: IsInArrayDirective,
      multi: true,
    },
  ],
})
export class IsInArrayDirective implements Validator {
  @Input() arrayToCheck: IAutoCompleteItem[];
  @Input() isRequired: boolean = false;

  validate(control: AbstractControl): ValidationErrors | null {
    if(!this.isRequired) {
      return null;
    } else {
      if (!this.arrayToCheck.map(d => d.id).includes(control.value)) {
        return { 'isInArray': 'Izaberi iz menija' };
      } else {
        return null;
      }
    }

  }
}
