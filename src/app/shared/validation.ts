/*
 * File:        /src/app/shared/validation.ts
 * Description: Angular Custom Validator to implement password and confirm password validation..
 *                – First, the validator returns null (meaning validation has passed) if there is any error
 *                  on the control that we want to check (confirm password).
 *                – Then, the validator checks that two fields match or not and set error on checking
 *                  control if validation fails.
 * Used by:     src/app/components/attribute-dictionary/add-attribute-dictionary
 * Dependency:
 *
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-06-03   C2RLO     Init
 */


import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    };
  }
}
