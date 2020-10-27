import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'comments-dialog',
  templateUrl: 'comments-dialog.html',
  styleUrls: ['comments-dialog.scss'],
})
export class CommentsDialog {
  mComments: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CommentsDialog>) {
    if (data) {
      data.res.text = this.htmlDecode(data.res.text);
      this.mComments = data.res;
      this.title = data.title;
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
  htmlDecode(input): string{
    return new DOMParser().parseFromString(input, 'text/html').documentElement.textContent;
  }


}
