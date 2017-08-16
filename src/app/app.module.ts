import { MY_DATE_FORMATS } from './locale.adapter/date.format';
import { MyDateAdapter } from './locale.adapter/date.adapter';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule, MdNativeDateModule, MD_DATE_FORMATS, DateAdapter, NativeDateAdapter } from '@angular/material';
import { ChartsModule } from 'ng2-charts';
import 'hammerjs';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component/app.component';
import { LoginComponent } from './login.component/login.component';
import { SignupComponent } from './signup.component/signup.component';
import { MessageDialogComponent } from './message-dialog.component/message-dialog.component';
import { UserEditComponent } from './user-edit.component/user-edit.component';
import { UserControlComponent } from './user-control.component/user-control.component';
import { UserCellComponent } from './user-cell.component/user-cell.component';
import { UserRecoveryComponent } from './user-recovery.component/user-recovery.component';
import { EmailValidationComponent } from './email-verification.component/email-verification.component';
import { MainComponent } from './main.component/main.component';
import { SearchComponent } from './search.component/search.component';
import { FilterDialogComponent } from './filter-dialog.component/filter-dialog.component';
import { SysInfoComponent } from './sysinfo.component/sysinfo.component';
import { SurgeryCellComponent } from './surgery-cell.component/surgery-cell.component';
import { InputComponent } from './input.component/input.component';
import { PatientInputComponent } from './patient-input.component/patient-input.component';
import { SurgeryInputComponent } from './surgery-input.component/surgery-input.component';
import { CommentsComponent } from './comments.component/comments.component';
import { CommentInputComponent } from './comment-input.component/comment-input.component';
import { CommentCellComponent } from './comment-cell.component/comment-cell.component';
import { NotFoundComponent } from './not-found.component/not-found.component';

import { TokenService } from './services/login/token.service';
import { UserService } from './services/login/user.service';
import { UserRecoveryService } from './services/login/user-recovery.service';
import { PatientService } from './services/patient.service';
import { DoctorService } from './services/doctor.service';
import { SurgeryService } from './services/surgery.service';
import { SysInfoService } from './services/sysinfo.service';

import { CedulaPipe } from './ci.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    MessageDialogComponent,
    UserEditComponent,
    UserControlComponent,
    UserCellComponent,
    UserRecoveryComponent,
    EmailValidationComponent,
    MainComponent,
    FilterDialogComponent,
    SearchComponent,
    SysInfoComponent,
    SurgeryCellComponent,
    InputComponent,
    PatientInputComponent,
    SurgeryInputComponent,
    CommentsComponent,
    CommentInputComponent,
    CommentCellComponent,
    NotFoundComponent,
    CedulaPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    MdNativeDateModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    AppRoutingModule
  ],
  entryComponents: [
    FilterDialogComponent,
    MessageDialogComponent
  ],
  providers: [
    TokenService,
    UserService,
    UserRecoveryService,
    PatientService,
    DoctorService,
    SurgeryService,
    SysInfoService,
    { provide: LOCALE_ID, useValue: 'es-UY' },
    { provide: DateAdapter, useClass: MyDateAdapter },
    { provide: MD_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
