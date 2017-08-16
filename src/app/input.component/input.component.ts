import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { NgXCookies } from 'ngx-cookies';
import { MdDialog } from '@angular/material';

import { MessageDialogComponent } from '../message-dialog.component/message-dialog.component';

import 'rxjs/add/operator/switchMap';

import { PatientService } from '../services/patient.service';
import { SurgeryService } from '../services/surgery.service';
import { TokenService } from '../services/login/token.service';

import { ISrgry, Surgery } from '../data_model/surgery';
import { IPat, Patient } from '../data_model/patient';
import { Doctor } from '../data_model/doctor';
import { IComm, Comment } from '../data_model/comment';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  surgery = new Surgery();
  title = 'Nueva Cirugía';
  editing = false;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private patientServ: PatientService,
    private surgeryServ: SurgeryService,
    private tokenServ: TokenService
  ) {}

  ngOnInit() {
    if (NgXCookies.exists('access_token')) {
      this.tokenServ.validateToken().catch(this.logout.bind(this));
    } else {
      this.logout();
    }

    this.route.paramMap
      .switchMap((params: ParamMap) => this.surgeryServ.getSurgery(params.get('id')))
      .subscribe(res => {
        if (res) {
          this.title = 'Detalle de cirugía'
          this.surgery = res;
          this.editing = true;
        }
      });
  }

  private done(): void {
    if (!this.isFormValid()) {
      this.openErrorDialog();
      return;
    }

    if (this.editing) {
      // If the user is editing an old surgery edit both the patient and the surgery

      this.patientServ.updatePatient(this.surgery.patient._id, this.preparePatient());
      this.surgeryServ.updateSurgery(this.surgery._id, this.prepareSurgery(this.surgery.patient._id));
    } else {
      if (this.surgery.patient._id) {
        // If the surgery is registered to an already registered patient - update patient and create surgery

        this.patientServ.updatePatient(this.surgery.patient._id, this.preparePatient());
        this.surgeryServ.addSurgery(this.prepareSurgery(this.surgery.patient._id));
      } else {
        // If both the patient and the surgery are new create both

        this.patientServ.addPatient({
          id: this.surgery.patient.id,
          name: this.surgery.patient.name,
          last: this.surgery.patient.last,
          birthdate: this.surgery.patient.birthdate,
          background: this.surgery.patient.background
        }).then(res => {
          this.surgeryServ.addSurgery(this.prepareSurgery(res._id));
        }).catch(err => {console.log(err)});
      }
    }

    this.goBack();
  }

  private preparePatient(): IPat {
    return {
      id: this.surgery.patient.id,
      name: this.surgery.patient.name,
      last: this.surgery.patient.last,
      birthdate: this.surgery.patient.birthdate,
      background: this.surgery.patient.background
    };
  }

  private prepareSurgery(patientId: string): ISrgry {
    const comments: IComm[] = [];

    this.surgery.comments.forEach(comment => {
      comments.push({
        moment: comment.moment,
        body: comment.body,
        user: comment.user._id
      });
    });

    return {
      scheduled: this.surgery.scheduled,
      type: this.surgery.type,
      pathology: this.surgery.pathology,
      preop_valid: this.surgery.preop_valid,
      anes_valid: this.surgery.anes_valid,
      done: this.surgery.done,
      gos: this.surgery.gos,
      cod: this.surgery.cod,
      patient: patientId,
      surgeon: this.surgery.surgeon._id,
      comments: comments
    };
  }

  private isFormValid(): boolean {
    if (this.surgery.isValid()) {
      return true;
    }

    return false;
  }

  private openErrorDialog(): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Error',
        message: 'Hubo un error registrando la cirugía, revisa los datos que ingresaste.'
      }
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
