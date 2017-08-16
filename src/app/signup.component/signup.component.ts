import { FormGroupDirective, NgForm } from '@angular/forms/src/directives';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
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
              private dialog: MdDialog,
              private router: Router,
              private userServ: UserService,
              private tokenServ: TokenService) {}

  ngOnInit() {
    if (NgXCookies.exists('access_token')) {
      this.tokenServ.validateToken().then(res => this.router.navigateByUrl('/main'));
    }
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

    if (this.user.password.length === 0) {
      return false;
    }

    return true;
  }

  private attemptRegistration(): void {
    // Registers the user and shows a dialog on success
    if (!this.isFormValid()) {
      return;
    }

    this.userServ.addUser(this.user).then(this.openDialog.bind(this));
  }

  /**
   * Shows the success dialog and when closed it takes the user back to their previous location
   */
  private openDialog(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Exito',
        message: 'Su usuario se ha creado con éxito.\nEspere que un administrador lo active para empezar a trabajar.'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.goBack();
    });
  }

  private goBack(): void {
    this.location.back();
  }
}
