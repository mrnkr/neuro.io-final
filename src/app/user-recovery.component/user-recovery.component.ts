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
import { UserRecoveryService } from '../services/login/user-recovery.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-user-recovery',
  templateUrl: './user-recovery.component.html',
  styleUrls: ['./user-recovery.component.css']
})
export class UserRecoveryComponent implements OnInit {
  private showStageTwo = false;
  private user = {
    email: '',
    code: '',
    password: ''
  };

  constructor(private location: Location,
              private router: Router,
              private dialog: MdDialog,
              private tokenServ: TokenService,
              private userServ: UserRecoveryService
            ) {}

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

  private onPositiveClick(): void {
    if (this.showStageTwo) {
      if (this.user.code.length === 0 || this.user.password.length === 0) {
        return;
      }

      this.userServ.requestPasswordChange(this.user.email, this.user.code, this.user.password)
              .then(this.openPositiveDialog.bind(this))
              .catch(this.openNegativeDialog.bind(this));
    } else {
      if (this.user.email.length === 0 || !this.user.email.match(EMAIL_REGEX)) {
        return;
      }

      this.userServ.requestRecoveryCode(this.user.email)
              .then(res => this.showStageTwo = true)
              .catch(this.openNegativeDialog.bind(this));
    }
  }

  private openNegativeDialog(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Error',
        message: 'Hubo un error, intenta de nuevo!'
      }
    });
  }

  /**
   * Shows the success dialog and when closed it takes the user back to their previous location
   */
  private openPositiveDialog(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Éxito',
        message: 'Su usuario se ha modificado con exito.'
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
