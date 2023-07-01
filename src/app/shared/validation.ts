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
 * Date        By      Comments
 * ----------  ------  ------------------------------
 * 2023-06-18	 C2RLO	 Add atLeastOneValidator
 * 2023-06-03  C2RLO   Init
 */

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

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
    if (control.get('deviceId')?.value != '') i++
    if (control.get('modelId')?.value != '') i++
    if (control.get('connectionId')?.value != '') i++
    console.log('count Ids => ' + i)
    if (i > 1 || i == 0) {
      return { atLeastOneValidator: true }
    } else if (i == 1) {
      return null
    } else {
      return { atLeastOneValidator: true }
    }
  }

  numberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (isNaN(control?.value)) {
      return {
        number: true
      }
    }
    return null;
  }
}
