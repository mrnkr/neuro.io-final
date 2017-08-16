import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component/login.component';
import { SignupComponent } from './signup.component/signup.component';
import { UserEditComponent } from './user-edit.component/user-edit.component';
import { UserControlComponent } from './user-control.component/user-control.component';
import { UserRecoveryComponent } from './user-recovery.component/user-recovery.component';
import { EmailValidationComponent } from './email-verification.component/email-verification.component';
import { MainComponent } from './main.component/main.component';
import { SearchComponent } from './search.component/search.component';
import { SysInfoComponent } from './sysinfo.component/sysinfo.component';
import { InputComponent } from './input.component/input.component';
import { NotFoundComponent } from './not-found.component/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'edit_user', component: UserEditComponent },
  { path: 'user_control', component: UserControlComponent },
  { path: 'user_recovery', component: UserRecoveryComponent },
  { path: 'email_validation/:id', component: EmailValidationComponent },
  { path: 'main',  component: MainComponent },
  { path: 'main/:id', component: MainComponent },
  { path: 'search', component: SearchComponent },
  { path: 'sysinfo', component: SysInfoComponent },
  { path: 'input', component: InputComponent },
  { path: 'surgery/:id', component: InputComponent },
  { path: '**', redirectTo: '/404' },
  { path: '404', component: NotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
