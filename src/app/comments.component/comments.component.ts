import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Comment } from '../data_model/comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent {
  @Input() comments: Comment[];
  @Output() onCommentAdded = new EventEmitter<Comment[]>();

  addComment(comment: Comment): void {
    this.comments.push(comment);
    this.onCommentAdded.emit(this.comments);
  }
}
