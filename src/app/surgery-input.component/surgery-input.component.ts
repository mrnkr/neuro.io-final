import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { Doctor } from '../data_model/doctor';
import { Surgery } from '../data_model/surgery';

import { DoctorService } from '../services/doctor.service';
import { SurgeryService } from '../services/surgery.service';

@Component({
  selector: 'app-surgery-input',
  templateUrl: './surgery-input.component.html',
  styleUrls: ['./surgery-input.component.css']
})
export class SurgeryInputComponent implements OnInit, OnChanges {
  @Input() surgery: Surgery;
  @Output() onSurgeryChange = new EventEmitter<Surgery>();

  // Arrays for autocomplete
  doctors: Doctor[];
  pathologies: string[];
  surgeryTypes: string[];

  constructor(private doctorServ: DoctorService, private surgeryServ: SurgeryService) {}

  ngOnInit() {
    this.doctorServ.getDoctors().then(res => this.doctors = res);
    this.surgeryServ.getPathologies().then(res => this.pathologies = res);
    this.surgeryServ.getSurgeryTypes().then(res => this.surgeryTypes = res);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const prop in changes) {
      if (prop === 'surgery') {
        const change = changes[prop];
        this.onSurgeryChange.emit(change.currentValue);
      }
    }
  }

  private onSelectDoctor(id: string) {
    this.doctors.forEach(doctor => {
      if (doctor._id === id) {
        this.surgery.surgeon = doctor;
      }
    });
  }

  private setValue(flag: number): void {
    if (flag === 0) { // Setting anes_valid
      this.surgery.anes_valid = this.surgery.anes_valid ? undefined : new Date();
    }

    if (flag === 1) { // Setting preop_valid
      this.surgery.preop_valid = this.surgery.preop_valid ? undefined : new Date();
    }
  }

  private isItToday(): boolean {
    if (!this.surgery.scheduled) {
      return false;
    }

    if (this.surgery.scheduled.getDate() > new Date().getDate()) {
      return false;
    }

    if (this.surgery.scheduled.getMonth() > new Date().getMonth()) {
      return false;
    }

    if (this.surgery.scheduled.getFullYear() > new Date().getFullYear()) {
      return false;
    }

    return true;
  }
}
