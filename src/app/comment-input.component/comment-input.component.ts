import { Component, Output, EventEmitter } from '@angular/core';
import { NgXCookies } from 'ngx-cookies';

import { Doctor } from '../data_model/doctor';
import { DoctorService } from '../services/doctor.service';
import { Comment } from '../data_model/comment';

@Component({
  selector: 'app-comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.css']
})
export class CommentInputComponent {
  comment = new Comment();
  @Output() onCommentReady = new EventEmitter<Comment>();

  constructor(private doctorServ: DoctorService) {}

  sendComment(): void {
    if (this.comment.body.length === 0) {
      return;
    }

    const comment = new Comment();
    comment.moment = new Date();
    comment.body = this.comment.body;

    this.doctorServ.getDoctor(NgXCookies.getCookie('logged_user_id')).then(res => {
      comment.user = res;
      this.onCommentReady.emit(comment);
    });

    this.comment.body = '';
  }
}
