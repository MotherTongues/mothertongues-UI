import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { DataService } from '../data.service';
import { DictionaryEntryExportFormat } from '@mothertongues/search';
import { Subject } from 'rxjs';

@Component({
    selector: 'mtd-entry-list',
    styleUrls: ['entry-list.component.scss'],
    templateUrl: 'entry-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class EntryListComponent implements OnChanges, OnInit {
  edit = false;
  $entriesHash: Subject<{ [id: string]: DictionaryEntryExportFormat }>;
  @Input()
  parentEdit?: boolean;
  @Input()
  entries!: DictionaryEntryExportFormat[];
  // Emits the IDs of the entries checked while in edit mode
  @Output()
  selectionChange = new EventEmitter<Set<string>>();
  selected = new Set<string>();
  entryIDS: string[] = [];
  isModalOpen = false;
  modalEntry: DictionaryEntryExportFormat;
  constructor(public dataService: DataService) {
    this.$entriesHash = this.dataService.$entriesHash;
  }

  ngOnInit(): void {
    this.getEntryIDS();
  }

  getEntryIDS() {
    const entryIDS: string[] = [];
    this.entries.forEach((entry) => {
      if (entry.entryID) {
        entryIDS.push(entry.entryID);
      }
    });
    this.entryIDS = entryIDS;
  }

  onItemClick(entry: DictionaryEntryExportFormat) {
    // In edit mode the checkbox handles the click instead
    if (!this.edit) {
      this.showModal(entry);
    }
  }

  setSelected(entryID: string, checked: boolean) {
    const selected = new Set(this.selected);
    if (checked) {
      selected.add(entryID);
    } else {
      selected.delete(entryID);
    }
    this.selected = selected;
    this.selectionChange.emit(selected);
  }

  showModal(entry: DictionaryEntryExportFormat) {
    this.modalEntry = entry;
    this.isModalOpen = true;
  }

  setOpen(value: boolean) {
    this.isModalOpen = value;
  }

  didDismiss() {
    this.isModalOpen = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getEntryIDS();
    if (this.parentEdit !== undefined) {
      this.edit = this.parentEdit;
    }
    // Start each edit session with nothing selected
    if (changes['parentEdit'] && this.selected.size > 0) {
      this.selected = new Set();
      this.selectionChange.emit(this.selected);
    }
  }
}
