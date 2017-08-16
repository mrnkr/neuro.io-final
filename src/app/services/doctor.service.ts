import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NgXCookies } from 'ngx-cookies';

import 'rxjs/add/operator/toPromise';

import { IDoc, Doctor } from '../data_model/doctor';

@Injectable()
export class DoctorService {
  private baseUrl = 'http://localhost:3000/api/doctors';

  constructor(private http: Http) {}

  getDoctors(): Promise<Doctor[]> {
    return this.http.get(this.baseUrl, { headers: this.generateHeaders() })
            .toPromise()
            .then(res => {
               const doctors = res.json() as Doctor[];

               doctors.forEach((item, index) => {
                doctors[index] = new Doctor(item);
               });

               return doctors;
             })
            .catch(this.handleError);
  }

  getDoctor(id: string): Promise<Doctor> {
    return this.http.get(this.baseUrl + '/' + id, { headers: this.generateHeaders() })
            .toPromise()
            .then(res => new Doctor(res.json() as Doctor))
            .catch(this.handleError);
  }

  addDoctor(doctor: IDoc): Promise<Doctor> {
    return this.http.post(this.baseUrl, JSON.stringify(doctor), { headers: this.generateHeaders() })
            .toPromise()
            .then(res => new Doctor(res.json() as Doctor))
            .catch(this.handleError);
  }

  private generateHeaders(): Headers {
    return new Headers({
      'Content-Type': 'application/json',
      'Authorization': NgXCookies.getCookie('token_type') + ' ' + NgXCookies.getCookie('access_token')
    });
  }

  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
