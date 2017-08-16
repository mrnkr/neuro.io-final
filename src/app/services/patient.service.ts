import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NgXCookies } from 'ngx-cookies';

import 'rxjs/add/operator/toPromise';

import { IPat, Patient } from '../data_model/patient';

@Injectable()
export class PatientService {
  private baseUrl = 'http://localhost:3000/api/patients';

  constructor(private http: Http) {}

  addPatient(patient: IPat): Promise<Patient> {
    return this.http.post(this.baseUrl, JSON.stringify(patient), { headers: this.generateHeaders() })
            .toPromise()
            .then(res => new Patient(res.json() as Patient))
            .catch(this.handleError);
  }

  updatePatient(_id: string, patient: IPat): Promise<Patient> {
    return this.http.put(this.baseUrl + '/' + _id, JSON.stringify(patient), { headers: this.generateHeaders() })
            .toPromise()
            .then(res => new Patient(res.json() as Patient))
            .catch(this.handleError);
  }

  searchPatient(query: string): Promise<Patient[]> {
    return this.http.get(this.baseUrl + '?last__regex=/^' + query + '/i', { headers: this.generateHeaders() })
            .toPromise()
            .then(res => {
               const patients = res.json() as Patient[];

               patients.forEach((item, index) => {
                patients[index] = new Patient(item);
               });

               return patients;
             })
            .catch(this.handleError);
  }

  findPatientById(id: string): Promise<Patient> {
    return this.http.get(this.baseUrl + '?id=' + id, { headers: this.generateHeaders() })
            .toPromise()
            .then(res => new Patient(res.json()[0] as Patient))
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
