import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DataService } from '../data.service';
import { DictionaryEntry } from '../../config/entry';
import { Result } from '@mothertongues/search';

@Component({
  selector: 'mtd-entry-list',
  styleUrls: ['entry-list.component.scss'],
  templateUrl: 'entry-list.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class EntryListComponent implements OnChanges, OnInit {
  edit = false;
  formattedEntries: DictionaryEntry[] = [];
  maxResults = 20; // this can make it super slow if it's unconstrained
  $entriesHash;
  @Input()
  parentEdit!: boolean;
  @Input()
  entries!: Result[];
  @Input()
  searchterm!: string;
  @Input() threshold: number | undefined;
  constructor(public dataService: DataService) {
    this.$entriesHash = this.dataService.$entriesHash;
  }

  ngOnInit(): void {
    if (Array.isArray(this.entries[0])) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.formattedEntries = this.entries.map((x: Result) => [x[1], x[2]]);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.formattedEntries = this.entries;
    }
  }

  showModal(entry: DictionaryEntry) {
    console.log(entry);
    console.log('show modal for ' + entry);
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
    this.edit = this.parentEdit;
  }

  trackByFn(index: number, item: DictionaryEntry) {
    console.log(item);
    console.log(index);
    return item.entryID;
  }
}
