import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NgXCookies } from 'ngx-cookies';

import 'rxjs/add/operator/toPromise';

import { User } from '../../data_model/login/user';

@Injectable()
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: Http) {}

  addUser(user: User): Promise<User> {
    return this.http.post(this.baseUrl, JSON.stringify(user), { headers: new Headers({
      'Content-Type': 'application/json'
    })})
            .toPromise()
            .then(res => res.json() as User)
            .catch(this.handleError);
  }

  getUsers(): Promise<User[]> {
    return this.http.get(this.baseUrl + '?sort=-active&&verified=true', { headers: this.generateHeaders() })
            .toPromise()
            .then(res => res.json() as User[])
            .catch(this.handleError);
  }

  getMyUser(): Promise<User> {
    return this.http.get(this.baseUrl.substr(0, this.baseUrl.length - 1), { headers: this.generateHeaders() })
            .toPromise()
            .then(res => res.json() as User)
            .catch(this.handleError)
  }

  updateUser(user: User): Promise<User> {
    return this.http.put(this.baseUrl + '/' + user._id, JSON.stringify(user), { headers: this.generateHeaders() })
            .toPromise()
            .then(res => res.json() as User)
            .catch(this.handleError);
  }

  deleteUser(id: string): void {
    this.http.delete(this.baseUrl + '/' + id, { headers: this.generateHeaders() })
            .toPromise()
            .catch(this.handleError);
  }

  /**
   * Allows the user to mark their email as valid
   * @param id - User ID
   */
  validateUserEmail(id: string): Promise<void> {
    return this.http.put('http://localhost:3000/api/email_validation/' + id, {})
            .toPromise()
            .then(res => console.log(res))
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
