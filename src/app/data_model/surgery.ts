import { Patient } from './patient';
import { Doctor } from './doctor';
import { IComm, Comment } from './comment';

export interface ISrgry {
  scheduled: Date;
  type: string;
  pathology: string;
  preop_valid: Date;
  anes_valid: Date;
  done: boolean;
  gos: number;
  cod: boolean;

  patient: string;
  surgeon: string;
  comments: IComm[];
}

export class Surgery {
  _id: string;
  scheduled: Date;
  type: string;
  pathology: string;
  preop_valid: Date;
  anes_valid: Date;
  done: boolean;
  gos: number;
  cod: boolean;

  patient: Patient;
  surgeon: Doctor;
  comments: Comment[];

  constructor();
  // tslint:disable-next-line:unified-signatures
  constructor(obj: Surgery);
  constructor(obj?: any) {
    if (obj) {
      this._id = obj._id;

      if (obj.scheduled) {
        if (obj.scheduled !== '1970-01-01T00:00:00.000Z') {
          this.scheduled = new Date(obj.scheduled);
        }
      }

      this.type = obj.type;
      this.pathology = obj.pathology;
      this.preop_valid = obj.preop_valid ? new Date(obj.preop_valid) : obj.preop_valid;
      this.anes_valid = obj.anes_valid ? new Date(obj.anes_valid) : obj.anes_valid;
      this.done = obj.done;
      this.gos = obj.gos;
      this.cod = obj.cod;

      this.patient = new Patient(obj.patient);
      this.surgeon = new Doctor(obj.surgeon);

      this.comments = [];
      obj.comments.forEach(item => {
        this.comments.push(new Comment(item));
      });

      return;
    }

    this.type = '';
    this.pathology = '';
    this.done = false;

    this.patient = new Patient();
    this.surgeon = new Doctor();
    this.comments = [];
  }

  get off_schedule(): boolean {
    if (this.scheduled < new Date()) {
      if (this.scheduled.getFullYear() < new Date().getFullYear()) {
        return true;
      }

      if (this.scheduled.getMonth() < new Date().getMonth()) {
        return true;
      }

      if (this.scheduled.getDate() < new Date().getDate()) {
        return true;
      }

      return false;
    }
  }

  get alert(): number {
    if (this.done) {
      return 0;
    }

    if (this.off_schedule) {
      return 1;
    }

    const monthInMillis = 7880000000;

    if (this.anes_valid) {
      if ((new Date().getTime() - this.anes_valid.getTime()) > monthInMillis) {
        return 2;
      }
    }

    return 0;
  }

  isValid(): boolean {
    if (this.hasValidDoctor() && this.hasValidType() && this.hasValidPathology() && this.hasValidPatient()) {
      return true;
    }

    return false;
  }

  private hasValidType(): boolean {
    if (this.type.length > 0) {
      return true;
    }

    return false;
  }

  private hasValidPathology(): boolean {
    if (this.pathology.length > 0) {
      return true;
    }

    return false;
  }

  private hasValidDoctor(): boolean {
    if (this.surgeon.isValid()) {
      return true;
    }

    return false;
  }

  private hasValidPatient(): boolean {
    if (this.patient.isValid()) {
      return true;
    }

    return false;
  }
}
