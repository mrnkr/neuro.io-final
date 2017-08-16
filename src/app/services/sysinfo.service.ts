import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { NgXCookies } from 'ngx-cookies';

import 'rxjs/add/operator/toPromise';

import { SysInfo } from '../data_model/sysinfo/sysinfo';

@Injectable()
export class SysInfoService {
  private baseUrl = 'http://localhost:3000/api/sysinfo';

  constructor(private http: Http) {}

  getSysInfo(): Promise<SysInfo> {
    return this.http.get(this.baseUrl, { headers: this.generateHeaders() })
            .toPromise()
            .then(res => res.json() as SysInfo)
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
