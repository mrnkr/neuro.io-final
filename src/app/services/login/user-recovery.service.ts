import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NgXCookies } from 'ngx-cookies';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserRecoveryService {
  constructor(private http: Http) {}

  requestRecoveryCode(email: string): Promise<void> {
    return this.http.put('http://localhost:3000/api/recovery/' + email, { reco_code: '' })
            .toPromise()
            .then(res => console.log(res))
            .catch(this.handleError);
  }

  requestPasswordChange(email: string, code: string, password: string): Promise<void> {
    const basicCredentials = email + ':' + code;
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(basicCredentials)
    });

    return this.http.put('http://localhost:3000/api/recover_user', { password: password }, { headers: headers })
            .toPromise()
            .then(res => console.log(res))
            .catch(this.handleError);
  }

  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
