import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgXCookies } from 'ngx-cookies';
import { MdSnackBar } from '@angular/material';

import { TokenService } from '../services/login/token.service';
import { User } from '../data_model/login/user';
import { UserService } from '../services/login/user.service';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrls: ['./user-control.component.css']
})
export class UserControlComponent implements OnInit {
  users: User[];

  constructor(private location: Location,
              private router: Router,
              private snackBar: MdSnackBar,
              private userServ: UserService,
              private tokenServ: TokenService
            ) {}

  ngOnInit() {
    // Check if the provided access token is valid
    // To be here the user has to be an admin too!
    if (NgXCookies.exists('access_token')) {
      this.tokenServ.validateToken()
              .then(res => {
                this.userServ.getMyUser().then(me => {
                  if (!me.admin) {
                    this.router.navigateByUrl('/main');
                  }
                });
              })
              .catch(this.logout.bind(this));
    } else {
      this.logout();
    }

    this.userServ.getUsers().then(res => {
      this.users = [];
      
      res.forEach((item, index) => {
        setTimeout(() => {
          this.users.push(item);
        }, 300 * (index + 1));
      });
    });
  }

  private onUserDelete(index: number): void {
    const deleted: User = this.users[index];
    let undone = false;

    this.users.splice(index, 1);

    const snackBarRef = this.snackBar.open('Usuario eliminado', 'DESHACER', {
      duration: 3000
    });

    snackBarRef.afterDismissed().subscribe(() => {
      if (!undone) {
        this.userServ.deleteUser(deleted._id);
      }
    });

    snackBarRef.onAction().subscribe(() => {
      undone = true;
      this.users.push(deleted);
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
