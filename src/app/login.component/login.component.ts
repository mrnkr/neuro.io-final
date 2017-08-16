import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgXCookies } from 'ngx-cookies';
import { MdDialog } from '@angular/material';

import { MessageDialogComponent } from '../message-dialog.component/message-dialog.component';

import { User } from '../data_model/login/user';
import { TokenService } from '../services/login/token.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {
    _id: '',
    email: '',
    name: '',
    last: '',
    password: '',
    admin: false,
    active: false,
    verified: false
  };

  constructor(private router: Router, private dialog: MdDialog, private tokenServ: TokenService) {}

  /**
   * Check if there is a stored token and, in such case, if it is valid
   */
  ngOnInit() {
    if (NgXCookies.exists('access_token')) {
      this.tokenServ.validateToken().then(res => this.router.navigateByUrl('/main'));
    }
  }

  private attemptLogin(): void {
    if (this.user.email.length === 0) {
      this.openErrorDialog();
      return;
    }

    this.tokenServ.getAccessToken(this.user.email, this.user.password)
            .then(res => {
              NgXCookies.setCookie('access_token', res.access_token, 12, 'hours');
              NgXCookies.setCookie('token_type', res.token_type, 12, 'hours');

              this.tokenServ.validateToken()
                      .then(ok => this.router.navigateByUrl('/main'))
                      .catch(err => {
                        NgXCookies.deleteCookie('access_token');
                        NgXCookies.deleteCookie('token_type');
                        this.openErrorDialog();
                      });
            })
            .catch(this.openErrorDialog.bind(this)); // The bind() method allows 'this' to be the Component inside the different scope
  }

  private openErrorDialog() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Error',
        message: 'Hubo un error iniciando sesión. Se puede haber equivocado o su usuario no está activo.'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.user.password = '';
    });
  }
}
