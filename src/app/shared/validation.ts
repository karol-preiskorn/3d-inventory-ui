/**
 * @description Angular Custom Validator to implement password and confirm password validation.
 *
 *  – First, the validator returns null (meaning validation has passed) if there is any error
 *    on the control that we want to check (confirm password).
 *  – Then, the validator checks that two fields match or not and set error on checking
 *    control if validation fails.
 *
 * @used by: src/app/components/connection/edit-connection/edit-connection.component.ts
 * @version 2023-06-18 C2RLO Add atLeastOneValidator
 * @version 2023-06-03 C2RLO Init
 * @public
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @description custom validation form shared module
 * @export
 * @class Validation
 */
export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName)
      const checkControl = controls.get(checkControlName)

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ matching: true })
        return { matching: true }
      } else {
        return null
      }
    }
  }

  /**
   * One of deviceId, modelId and connectionId have to set
   *
   * @param {AbstractControl} control
   * @type {ValidatorFn}
   * @memberof Validation
   */
  atLeastOneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let i = 0
    if (control.get('deviceId')?.value !== '') {i++}
    if (control.get('modelId')?.value !== '') {i++}
    if (control.get('connectionId')?.value !== '') {i++}
    console.log('count Ids => ' + i)
    if (i > 1 || i === 0) {
      return { atLeastOneValidator: true }
    } else if (i === 1) {
      return null
    } else {
      return { atLeastOneValidator: true }
    }
  }
  /**
   * @description check is it number
   * @param {AbstractControl} control
   * @type {ValidatorFn}
   * @memberof Validation
   */
  numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    try {
      const value = control?.value;
      // Accept both numbers and numeric strings
      if (value === null || value === undefined || value === '') {
        return { number: true };
      }
      const num = typeof value === 'number' ? value : Number(value);
      if (typeof num !== 'number' || isNaN(num)) {
        return { number: true };
      }
      return null;
    } catch (error) {
      return { number: true, error: (error as Error).message };
    }
  }
}
