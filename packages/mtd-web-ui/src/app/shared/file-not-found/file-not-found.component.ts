import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'mtd-file-not-found-dialog',
  templateUrl: 'file-not-found.component.html',
})
export class FileNotFoundDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FileNotFoundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
