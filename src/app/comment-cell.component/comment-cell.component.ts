import { Component, Input } from '@angular/core';

import { Comment } from '../data_model/comment';

@Component({
  selector: 'app-comment-cell',
  templateUrl: './comment-cell.component.html',
  styleUrls: ['./comment-cell.component.css']
})
export class CommentCellComponent {
  @Input() comment: Comment;
}
