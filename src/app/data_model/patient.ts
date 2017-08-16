export interface IPat {
  id: string;
  name: string;
  last: string;
  birthdate: Date;
  background: string;
}

export class Patient {
  _id: string;
  id: string;
  name: string;
  last: string;
  birthdate: Date;
  background: string;

  constructor();
  // tslint:disable-next-line:unified-signatures
  constructor(obj: Patient);
  constructor(obj?: any) {
    if (obj) {
      this._id = obj._id;
      this.id = obj.id;
      this.name = obj.name;
      this.last = obj.last;
      this.birthdate = new Date(obj.birthdate);
      this.background = obj.background;

      return;
    }

    this.id = '';
    this.name = '';
    this.last = '';
    this.background = '';
  }

   isValid(): boolean {
    if (this.hasValidId() && this.hasValidName() && this.hasValidLast() && this.hasValidBirthdate()) {
      return true;
    }

    return false;
  }

  private hasValidId(): boolean {
    if (this.id.length === 8) {
      return true;
    }

    return false;
  }

  private hasValidName(): boolean {
    if (this.name.length > 0) {
      return true;
    }

    return false;
  }

  private hasValidLast(): boolean {
    if (this.last.length > 0) {
      return true;
    }

    return false;
  }

  private hasValidBirthdate(): boolean {
    if (this.birthdate) {
      return true;
    }

    return false;
  }
}
