import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DataService } from '../data.service';
import { DictionaryEntryExportFormat } from '../../config/entry';
import { Subject } from 'rxjs';

@Component({
  selector: 'mtd-entry-list',
  styleUrls: ['entry-list.component.scss'],
  templateUrl: 'entry-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EntryListComponent implements OnChanges, OnInit {
  edit = false;
  $entriesHash: Subject<{ [id: string]: DictionaryEntryExportFormat }>;
  @Input()
  parentEdit?: boolean;
  @Input()
  entries!: DictionaryEntryExportFormat[];
  entryIDS: string[] = []
  constructor(public dataService: DataService) {
    this.$entriesHash = this.dataService.$entriesHash;
  }

  ngOnInit(): void {
    this.getEntryIDS()
  }

  getEntryIDS() {
    const entryIDS: string[] = []
    this.entries.forEach((entry) => {
      if (entry.entryID) {
        entryIDS.push(entry.entryID)
      }
      })
      this.entryIDS = entryIDS
  }

  showModal(entry: DictionaryEntryExportFormat) {
    console.log(entry);
    console.log('show modal for ' + entry);
  }

  ngOnChanges() {
    this.getEntryIDS()
    if (this.parentEdit !== undefined) {
      this.edit = this.parentEdit
    }
  }

  trackByFn(index: number, item: DictionaryEntryExportFormat) {
    console.log(item);
    console.log(index);
    return item.entryID;
  }
}
