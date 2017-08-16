import { Doctor } from './doctor';

export interface IComm {
  moment: Date;
  body: String;

  user: string;
}

export class Comment {
  _id: string;
  moment: Date;
  body: String;

  user: Doctor;

  constructor();
  // tslint:disable-next-line:unified-signatures
  constructor(obj: Comment);
  constructor(obj?: any) {
    if (obj) {
      this._id = obj._id;
      this.moment = obj.moment;
      this.body = obj.body;
      this.user = new Doctor(obj.user);

      return;
    }

    this.body = '';
  }
}
