import {
  Component,
  Inject,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'mtd-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportDialogComponent {
  error: boolean;
  message: string;

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>,
    private ref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  async send(): Promise<void> {
    if (!(this.data && this.data.entry)) return;
    const entry_id = encodeURIComponent(this.data.entry.entryID);
    const url = encodeURIComponent(window.location.href);
    const word = encodeURIComponent(
      `${this.data.entry.word}: ${this.data.entry.definition}`
    );
    const msg = encodeURIComponent(this.message);
    const reporter = `https://michif.org/report.php?id=${entry_id}&url=${url}&word=${word}&desc=${msg}`;
    try {
      const response = await fetch(reporter);
      if (response.ok) this.dialogRef.close('reported');
      else {
        this.error = true;
        this.ref.markForCheck();
      }
    } catch (err) {
      // But we'll see it anyway
      console.log(err);
      this.error = true;
      this.ref.markForCheck();
    }
  }
}
