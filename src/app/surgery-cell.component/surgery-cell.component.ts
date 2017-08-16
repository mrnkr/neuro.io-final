import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Surgery } from '../data_model/surgery';

@Component({
  selector: 'app-surgery-cell',
  templateUrl: './surgery-cell.component.html',
  styleUrls: ['./surgery-cell.component.css']
})
export class SurgeryCellComponent {
  @Input() surgery: Surgery;
  @Output() onSurgeryDelete = new EventEmitter<void>();

  animation = 'fadeInDown';

  private onDeleteClick() {
    this.animation = 'fadeOutRight';

    setTimeout(() => {
      this.onSurgeryDelete.emit();
    }, 500);
  }
}
