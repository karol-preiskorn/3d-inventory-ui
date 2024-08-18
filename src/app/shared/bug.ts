/**
 * @description Represents a bug in the system.
 * @abstract This class is used to represent a bug in the system.
 * @public
 * @class Bug
 * @property {string} id - The id of the bug.
 * @property {string} issue_name - The name of the bug.
 * @property {string} issue_message - The message of the bug.
 */

export class Bug {
  id: string
  issue_name: string
  issue_message: string

  constructor() {
    this.id = ''
    this.issue_name = ''
    this.issue_message = ''
  }
}
