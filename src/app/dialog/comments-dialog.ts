import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-comments-dialog',
  templateUrl: 'comments-dialog.html',
  styleUrls: ['comments-dialog.scss'],
})
export class CommentsDialogComponent {
  mComments: any;
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CommentsDialogComponent>) {
    if (data) {
      this.mComments = data.comments;
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
