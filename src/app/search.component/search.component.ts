import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgXCookies } from 'ngx-cookies';
import { MdSnackBar } from '@angular/material';

import { Patient } from '../data_model/patient';
import { PatientService } from '../services/patient.service';
import { TokenService } from '../services/login/token.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchText = '';
  searchResults: Patient[] = [];

  constructor(private location: Location,
              private router: Router,
              private patientServ: PatientService,
              private tokenServ: TokenService
            ) {}

  ngOnInit() {
    if (NgXCookies.exists('access_token')) {
      this.tokenServ.validateToken().catch(this.logout.bind(this));
    } else {
      this.logout();
    }
  }

  private performSearch(): void {
    if (this.searchText === '') {
      this.clearSearch();
      return;
    }

    this.patientServ.searchPatient(this.searchText).then(res => this.searchResults = res);
  }

  private clearSearch(): void {
    this.searchText = '';
    this.searchResults = [];
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
