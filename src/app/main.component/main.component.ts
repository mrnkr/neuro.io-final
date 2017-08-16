import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgXCookies } from 'ngx-cookies';
import { MdSnackBar, MdDialogRef, MdDialog } from '@angular/material';

import 'rxjs/add/operator/switchMap';

import { FilterDialogComponent } from '../filter-dialog.component/filter-dialog.component';

import { Surgery } from '../data_model/surgery';
import { SurgeryService } from '../services/surgery.service';
import { TokenService } from '../services/login/token.service';
import { User } from '../data_model/login/user';
import { UserService } from '../services/login/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  surgeries: Surgery[] = [];
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

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private surgeryServ: SurgeryService,
    private tokenServ: TokenService,
    private userServ: UserService,
    private snackBar: MdSnackBar,
    private dialog: MdDialog
  ) {}

  ngOnInit() {
    if (NgXCookies.exists('access_token')) {
      this.tokenServ.validateToken().catch(this.logout.bind(this));
    } else {
      this.logout();
    }

    this.userServ.getMyUser()
            .then(res => this.user = res)
            .catch(this.openDialog.bind(this));

    this.route.paramMap
      .switchMap((params: ParamMap) => this.surgeryServ.getSurgeriesForPatient(params.get('id')))
      .subscribe(res => this.loadSurgeries(res), error => {
        this.surgeryServ.getSurgeries({
          scheduled: 'today',
          pathology: null,
          type: null,
          valid: null,
          done: null,
          gos: null,
          doctor: null
        }).then(this.loadSurgeries.bind(this));
      });
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.surgeryServ.getSurgeries(result).then(this.loadSurgeries.bind(this));
      }
    });
  }

  private loadSurgeries(surgeries: Surgery[]): void {
    this.surgeries = [];

    surgeries.forEach((item, index) => {
      setTimeout(() => {
        this.surgeries.push(item);
      }, 300 * (index + 1));
    });
  }

  private deleteSurgery(index: number): void {
    const deleted: Surgery = this.surgeries[index];
    let undone = false;

    this.surgeries.splice(index, 1);

    const snackBarRef = this.snackBar.open('Cirugía eliminada', 'DESHACER', {
      duration: 3000
    });

    snackBarRef.afterDismissed().subscribe(() => {
      if (!undone) {
        this.surgeryServ.deleteSurgery(deleted._id);
      }
    });

    snackBarRef.onAction().subscribe(() => {
      undone = true;
      this.surgeries.push(deleted);
    });
  }

  private logout(): void {
    NgXCookies.deleteCookie('access_token');
    NgXCookies.deleteCookie('token_type');
    this.router.navigateByUrl('/login');
  }
}
