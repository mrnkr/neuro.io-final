import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-message-dialog',
  templateUrl: 'message-dialog.component.html',
})
export class MessageDialogComponent {
  constructor(
    public dialogRef: MdDialogRef<MessageDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {}
}
