import { FormGroupDirective, NgForm } from '@angular/forms/src/directives';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgXCookies } from 'ngx-cookies';
import { MdDialog } from '@angular/material';

import { MessageDialogComponent } from '../message-dialog.component/message-dialog.component';

import 'rxjs/add/operator/switchMap';

import { TokenService } from '../services/login/token.service';
import { User } from '../data_model/login/user';
import { UserService } from '../services/login/user.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
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

  constructor(private location: Location,
              private router: Router,
              private dialog: MdDialog,
              private userServ: UserService,
              private tokenServ: TokenService
            ) {}

  ngOnInit() {
    if (NgXCookies.exists('access_token')) {
      this.tokenServ.validateToken().catch(this.logout.bind(this));
    } else {
      this.logout();
    }

    // Make the user object have the user's info
    this.userServ.getMyUser().then(res => this.user = res);
  }

  private myErrorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    // Error when invalid control is dirty, touched, or submitted
    const isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  private isFormValid(): boolean {
    if (this.user.email.length === 0) {
      return false;
    }

    if (!this.user.email.match(EMAIL_REGEX)) {
      return false;
    }

    if (this.user.name.length === 0) {
      return false;
    }

    if (this.user.last.length === 0) {
      return false;
    }

    return true;
  }

  private attemptUpdate(): void {
    if (!this.isFormValid()) {
      return;
    }

    // Registers the user and shows a dialog on success
    this.userServ.updateUser(this.user).then(this.openDialog.bind(this));
  }

  /**
   * Shows the success dialog and when closed it takes the user back to their previous location
   */
  private openDialog(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Éxito',
        message: 'Su usuario se ha modificado correctamente.'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.goBack();
    });
  }

  private goBack(): void {
    this.location.back();
  }

  private logout(): void {
    NgXCookies.deleteCookie('access_token');
    NgXCookies.deleteCookie('token_type');
    this.router.navigateByUrl('/login');
  }
}
