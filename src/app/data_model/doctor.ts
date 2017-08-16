export interface IDoc {
  email: string;
  name: string;
  last: string;
}

export class Doctor {
  _id: string;
  email: string;
  name: string;
  last: string;

  constructor();
  // tslint:disable-next-line:unified-signatures
  constructor(obj: Doctor);
  constructor(obj?: any) {
    if (obj) {
      this._id = obj._id;
      this.email = obj.email;
      this.name = obj.name;
      this.last = obj.last;

      return;
    }

    this.email = '';
    this.name = '';
    this.last = '';
  }

  isValid(): boolean {
    // If the doctor was registered it means their data is valid (validated on user level)
    if (this._id) {
      return true;
    }

    return false;
  }
}
