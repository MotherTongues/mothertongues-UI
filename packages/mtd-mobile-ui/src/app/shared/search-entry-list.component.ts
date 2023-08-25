import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DataService } from '../data.service';
import { DictionaryEntryExportFormat } from '../../config/mtd';
import { Result } from '@mothertongues/search';

@Component({
  selector: 'mtd-search-entry-list',
  styleUrls: ['entry-list.component.scss'],
  templateUrl: 'search-entry-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SearchEntryListComponent implements OnChanges, OnInit {
  edit = false;
  maxResults = 20; // this can make it super slow if it's unconstrained
  $entriesHash;
  @Input()
  parentEdit!: boolean;
  @Input()
  entries!: Result[];
  @Input()
  searchterm!: string;
  @Input() threshold?: number;
  isModalOpen = false;
  modalEntry: DictionaryEntryExportFormat;
  constructor(public dataService: DataService) {
    this.$entriesHash = this.dataService.$entriesHash;
  }

  ngOnInit(): void {}

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

  highlight(result: Result, lang: 'L1' | 'L2') {
    // highlighting in this interface only happens on either words or definitions
    const key = lang === 'L1' ? 'word' : 'definition';
    const terms = this.$entriesHash.value[result[1]][key].split(/\s+/);
    const htmlTerms = terms.map((word: any) => `<span>${word}</span>`);
    result[2].forEach((match) => {
      if (match[0] === key) {
        htmlTerms[match[1]] = `<span class="langMatched">${
          terms[match[1]]
        }</span>`;
      }
    });
    return htmlTerms.join(' ');
  }

  ngOnChanges() {
    if (this.parentEdit !== undefined) {
      this.edit = this.parentEdit;
    }
  }

  trackByFn(index: number, item: DictionaryEntryExportFormat) {
    return item.entryID;
  }
}
