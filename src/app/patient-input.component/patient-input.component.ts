import { FormGroupDirective, NgForm } from '@angular/forms/src/directives';
import { FormControl } from '@angular/forms';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Patient } from '../data_model/patient';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient-input',
  templateUrl: './patient-input.component.html',
  styleUrls: ['./patient-input.component.css']
})
export class PatientInputComponent {
  @Input() editing: boolean;
  @Input() patient: Patient;
  @Output() onPatientChange = new EventEmitter<Patient>();

  constructor(private patientServ: PatientService) {}

  private myErrorStateMatcher(control: FormControl, form: FormGroupDirective | NgForm): boolean {
    // Error when invalid control is dirty, touched, or submitted
    const isSubmitted = form && form.submitted;
    return !!(control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  private emitChange(): void {
    this.onPatientChange.emit(this.patient);
  }

  private autocomplete(): void {
    this.patientServ.findPatientById(this.patient.id).then(res => {
      this.editing = true;

      this.patient._id = res._id;
      this.patient.name = res.name;
      this.patient.last = res.last;
      this.patient.birthdate = res.birthdate;
      this.patient.background = res.background;

      this.emitChange();
    });
  }
}
