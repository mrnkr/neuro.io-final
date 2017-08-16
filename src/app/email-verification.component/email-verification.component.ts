import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgXCookies } from 'ngx-cookies';

import { User } from '../data_model/login/user';
import { UserService } from '../services/login/user.service';

@Component({
  selector: 'app-email-validation',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailValidationComponent implements OnInit {
  message = 'Espera por favor...';

  constructor(private router: Router, private route: ActivatedRoute, private userServ: UserService) {}

  /**
   * Execute the email validation process and return the corresponding message
   */
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userServ.validateUserEmail(params.get('id'))
              .then(res => this.message = 'Éxito! Espera a que te llevemos a iniciar sesión...')
              .catch(err => this.message = 'Error! Intenta más tarde...');
    });

    setTimeout(() => this.router.navigateByUrl('/login'), 3000);
  }
}
