import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { Doctor } from '../data_model/doctor';
import { DoctorService } from '../services/doctor.service';
import { SurgeryService } from '../services/surgery.service';
import { SurgeryFilter } from '../surgery.filter';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit {
  filter: SurgeryFilter = {
          scheduled: 'today',
          pathology: null,
          type: null,
          valid: null,
          done: null,
          gos: null,
          doctor: null
        };
  doctors: Doctor[];
  pathologies: string[];
  surgeryTypes: string[];


  constructor(
    public dialogRef: MdDialogRef<FilterDialogComponent>,
    private doctorServ: DoctorService,
    private surgeryServ: SurgeryService
  ) {}

  ngOnInit() {
    this.doctorServ.getDoctors().then(res => this.doctors = res);
    this.surgeryServ.getPathologies().then(res => this.pathologies = res);
    this.surgeryServ.getSurgeryTypes().then(res => this.surgeryTypes = res);
  }

  private onGosChange(ev: any): void {
    this.filter.gos = ev;

    if (this.filter.gos !== null) {
      this.filter.done = true;
    }
  }

  private onDoneChange(ev: any): void {
    this.filter.done = ev.checked;

    if (this.filter.gos !== null) {
      if (!this.filter.done) {
        this.filter.gos = null;
      }
    }
  }

  private clearFilter(): void {
    this.filter = {
          scheduled: null,
          pathology: null,
          type: null,
          valid: null,
          done: null,
          gos: null,
          doctor: null
        };
  }

  private validateFilter(): boolean {
    // tslint:disable:curly
    if (this.filter.scheduled === null)
      if (this.filter.pathology === null)
        if (this.filter.type === null)
          if (this.filter.valid === null)
            if (this.filter.done === null)
              if (this.filter.gos === null)
                if (this.filter.doctor === null)
                  return true;

    return false;
  }
}
