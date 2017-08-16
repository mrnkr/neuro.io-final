import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NgXCookies } from 'ngx-cookies';

import 'rxjs/add/operator/toPromise';

import { Token } from '../../data_model/login/token';

@Injectable()
export class TokenService {
  private baseUrl = 'http://localhost:3000/api/oauth2/token';
  private headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic YWJjMTIzOmh1YWNoaXBhdG8xMjM='
  });

  constructor(private http: Http) {}

  getAccessToken(username: string, password: string): Promise<Token> {
    const body = 'grant_type=password&&username=' + username + '&&password=' + password;

    return this.http.post(this.baseUrl, body, { headers: this.headers })
            .toPromise()
            .then(res => res.json() as Token)
            .catch(this.handleError);
  }

  validateToken(): Promise<boolean> {
    return this.http.get(this.baseUrl, { headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': NgXCookies.getCookie('token_type') + ' ' + NgXCookies.getCookie('access_token')
    })})
            .toPromise()
            .then(res => true)
            .catch(err => false);
  }

  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }
}
