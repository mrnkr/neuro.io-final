import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgXCookies } from 'ngx-cookies';

import { User } from '../data_model/login/user';
import { UserService } from '../services/login/user.service';

@Component({
  selector: 'app-user-cell',
  templateUrl: './user-cell.component.html',
  styleUrls: ['./user-cell.component.css']
})
export class UserCellComponent implements OnInit {
  @Input() user: User;
  @Output() onUserChange = new EventEmitter<User>();
  @Output() onUserDelete = new EventEmitter<void>();

  animation = 'fadeInDown';
  disabled = false;

  constructor(private userServ: UserService) {}

  ngOnInit() {
    if (this.user._id === NgXCookies.getCookie('logged_user_id')) {
      this.disabled = true;
    }
  }

  private onChangeClick(flag: number): void {
    if (flag === 0) {
      this.user.admin = !this.user.admin;
    }

    if (flag === 1) {
      this.user.active = !this.user.active;
    }

    this.userServ.updateUser(this.user).then(res => this.onUserChange.emit(res));
  }

  private onDeleteClick(): void {
    this.animation = 'fadeOutRight';

    setTimeout(() => {
      this.onUserDelete.emit();
    }, 500);
  }
}
