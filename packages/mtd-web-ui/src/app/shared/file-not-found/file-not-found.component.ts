import {
  Component,
  Input,
  Inject,
  OnChanges,
  SimpleChange
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'mtd-file-not-found-dialog',
  templateUrl: 'file-not-found.component.html'
})
export class FileNotFoundDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FileNotFoundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
