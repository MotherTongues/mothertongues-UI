import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DataService } from '../data.service';
import { DictionaryEntry } from '../../config/entry';
import { Subject } from 'rxjs';

@Component({
  selector: 'mtd-entry-list',
  styleUrls: ['entry-list.component.scss'],
  templateUrl: 'entry-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EntryListComponent implements OnChanges, OnInit {
  edit = false;
  $entriesHash: Subject<{ [id: string]: DictionaryEntry }>;
  @Input()
  parentEdit?: boolean;
  @Input()
  entries!: DictionaryEntry[];
  entryIDS: string[] = []
  constructor(public dataService: DataService) {
    this.$entriesHash = this.dataService.$entriesHash;
  }

  ngOnInit(): void {
    this.getEntryIDS()
  }

  getEntryIDS() {
    const entryIDS: string[] = []
    console.log(this.entries)
    this.entries.forEach((entry) => {
      if (entry.entryID) {
        entryIDS.push(entry.entryID)
      }
      })
      this.entryIDS = entryIDS
  }

  showModal(entry: DictionaryEntry) {
    console.log(entry);
    console.log('show modal for ' + entry);
  }

  ngOnChanges() {
    this.getEntryIDS()
    if (this.parentEdit !== undefined) {
      this.edit = this.parentEdit
    }
  }

  trackByFn(index: number, item: DictionaryEntry) {
    console.log(item);
    console.log(index);
    return item.entryID;
  }
}
