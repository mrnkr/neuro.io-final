import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NgXCookies } from 'ngx-cookies';

import 'rxjs/add/operator/toPromise';

import { ISrgry, Surgery } from '../data_model/surgery';
import { SurgeryFilter } from '../surgery.filter';

@Injectable()
export class SurgeryService {
  private baseUrl = 'http://localhost:3000/api/surgeries';

  constructor(private http: Http) {}

  getSurgeries(query?: SurgeryFilter): Promise<Surgery[]> {
    let filter = '';

    if (query) {
      filter = this.processQuery(query);
    }

    return this.http.get(this.baseUrl + '?' + filter +
                            'populate=patient&&populate=surgeon&&populate=comments.user', { headers: this.generateHeaders() })
             .toPromise()
             .then(res => {
               const surgeries = res.json() as Surgery[];

               surgeries.forEach((item, index) => {
                surgeries[index] = new Surgery(item);
               });

               return surgeries;
             })
             .catch(this.handleError);
  }

  getSurgery(surgeryId: string): Promise<Surgery> {
    return this.http.get(this.baseUrl + '/' + surgeryId + '?populate=patient&&populate=surgeon&&populate=comments.user',
          { headers: this.generateHeaders() })
            .toPromise()
            .then(res => new Surgery(res.json() as Surgery))
            .catch(this.handleError);
  }

  getSurgeriesForPatient(patientId: string): Promise<Surgery[]> {
    return this.http.get(this.baseUrl + '?patient=' + patientId +
                          '&&sort=-scheduled&&populate=patient&&populate=surgeon&&populate=comments.user',
                          { headers: this.generateHeaders() })
            .toPromise()
            .then(res => {
               const surgeries = res.json() as Surgery[];

               surgeries.forEach((item, index) => {
                surgeries[index] = new Surgery(item);
               });

               return surgeries;
             })
            .catch(this.handleError);
  }

  addSurgery(surgery: ISrgry): Promise<Surgery> {
    return this.http.post(this.baseUrl, JSON.stringify(surgery), { headers: this.generateHeaders() })
              .toPromise()
              .then(res => new Surgery(res.json() as Surgery))
              .catch(this.handleError);
  }

  updateSurgery(surgeryId: string, surgery: ISrgry): Promise<Surgery> {
    return this.http.put(this.baseUrl + '/' + surgeryId, JSON.stringify(surgery), { headers: this.generateHeaders() })
              .toPromise()
              .then(res => new Surgery(res.json() as Surgery))
              .catch(this.handleError);
  }

  deleteSurgery(surgeryId: string): void {
    this.http.delete(this.baseUrl + '/' + surgeryId, { headers: this.generateHeaders() })
              .toPromise()
              .catch(this.handleError);
  }

  getPathologies(): Promise<string[]> {
    return this.http.get('http://localhost:3000/api/pathologies', { headers: this.generateHeaders() })
              .toPromise()
              .then(res => res.json() as string[])
              .catch(this.handleError);
  }

  getSurgeryTypes(): Promise<string[]> {
    return this.http.get('http://localhost:3000/api/srg_types', { headers: this.generateHeaders() })
              .toPromise()
              .then(res => res.json() as string[])
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

  private processQuery(query: SurgeryFilter): string {
    const retVal = [];

    switch (query.scheduled) {
      case 'today':
        const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        retVal.push('scheduled=' + today.toISOString());
        break;
      case 'tomorrow':
        const tomorrow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1);
        retVal.push('scheduled=' + tomorrow.toISOString());
        break;
      case 'no-date':
        retVal.push('scheduled=' + '1970-01-01T00:00:00.000Z');
        break;
    }

    if (query.pathology) {
      retVal.push('pathology=' + query.pathology);
    }

    if (query.type) {
      retVal.push('type=' + query.type);
    }

    if (query.valid !== null) {
      const dummyDate = new Date();
      dummyDate.setTime(0);

      if (query.valid) {
        // All surgeries should take place after the beginning of computer time
        retVal.push('anes_valid__gt=' + dummyDate.toISOString() + '&&preop_valid__gt=' + dummyDate.toISOString());
      }
    }

    if (query.done !== null) {
      retVal.push('done=' + (query.done ? true : false));
    }

    if (query.gos !== null) {
      retVal.push(query.gos ? 'gos__ne=1' : 'gos=1');
    }

    if (query.doctor) {
      retVal.push('surgeon=' + query.doctor);
    }

    return retVal.join('&&') + '&&';
  }
}
