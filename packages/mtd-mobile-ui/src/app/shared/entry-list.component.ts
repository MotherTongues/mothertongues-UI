import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from "@angular/core";

import { Entry, ENTRIES_HASH } from "../../config/entries";
import { Result } from "@mothertongues/search";


@Component({
  selector: "mtd-entry-list",
  styleUrls: ["entry-list.component.scss"],
  templateUrl: "entry-list.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class EntryListComponent implements OnChanges, OnInit {
  edit = false;
  formattedEntries: Entry[] = [];
  maxResults = 20; // this can make it super slow if it's unconstrained
  entriesHash = ENTRIES_HASH;
  @Input()
    parentEdit!: boolean;
  @Input()
    entries!: Result[]; // TODO: should actually be Entry[] | Result[]
  @Input() 
    searchterm!: string;
  @Input() threshold: number | undefined;
  constructor() {
}

ngOnInit(): void {
    if (Array.isArray(this.entries[0])) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.formattedEntries = this.entries.map((x: Result) => [x[1], x[2]])
    } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.formattedEntries = this.entries
    }
    
}

showModal(entry: Entry) {
    console.log(entry)
    console.log('show modal for ' + entry)
}


highlight(result: Result, lang: 'L1' | 'L2') {
    // highlighting in this interface only happens on either words or definitions
    const key = lang === 'L1' ? 'word' : 'definition';
    const terms = ENTRIES_HASH[result[1]][key].split(/\s+/)
    const htmlTerms = terms.map((word) => `<span>${word}</span>`)
    result[2].forEach((match) => {
      if (match[0] === key) {
        htmlTerms[match[1]] = `<span class="langMatched">${terms[match[1]]}</span>`
      }
    })
    return htmlTerms.join(" ")
    
}

ngOnChanges() {
    this.edit = this.parentEdit;
  }

  trackByFn(index: number, item: Entry) {
    console.log(item)
    console.log(index)
    return item.entryID;
  }

}