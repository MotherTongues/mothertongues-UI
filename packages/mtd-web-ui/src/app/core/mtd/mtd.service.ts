import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config, DictionaryData } from '../models';
import { uniq } from 'lodash';
import { environment } from '../../../environments/environment';
import { META } from '../../../config/config';
import { slugify } from 'transliteration';

interface CategoryData {
  [category: string]: Array<DictionaryData>
}

const bogusConfig: Config = {
  L1: {
    name: "OMG",
    lettersInLanguage: ['O', 'M', 'G', 'W', 'T', 'F'],
  },
  L2: {
    name: "WTF",
  },
  build: "bogus"
}


@Injectable({ providedIn: 'root' })
export class MtdService {
  _dictionary_data$ = new BehaviorSubject<DictionaryData[]>([]);
  _config$ = new BehaviorSubject<Config>(bogusConfig);
  slug: string;
  base: string = environment.apiBaseURL;

  constructor() {
    this.slug = slugify(this._config$.getValue().L1.name);
  }

  /* FIXME: This is not an efficient way to sample random entries */
  private shuffle(array: Array<any>) {
    let copy = array.map(x => x);
    let tmp,
      current,
      top = copy.length;
    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = copy[current];
        copy[current] = copy[top];
        copy[top] = tmp;
      }
    }
    return copy;
  }

  getRandom$(no_random: number) {
    return this._dictionary_data$
      .asObservable()
      .pipe(map(x => this.shuffle(x).slice(0, no_random)));
  }

  getSlice$(start_index: number, no_slice: number) {
    return this._dictionary_data$
      .asObservable()
      .pipe(map(x => x.slice(start_index, start_index + no_slice)));
  }

  hasAudio(entry: DictionaryData) {
    if (!('audio' in entry)) return false;
    if (entry.audio instanceof Array) {
      const files = entry.audio.filter(audioFile => audioFile.filename);
      return !!files.length;
    }
    return !!entry.audio;
  }

  get allAudioEntries$() {
    return this._dictionary_data$
      .asObservable()
      .pipe(map(arr => arr.filter(this.hasAudio)));
  }

  get config$() {
    return this._config$.asObservable();
  }

  get name$() {
    return this.config$.pipe(map(config => config.L1.name));
  }

  get dataDict$() {
    return this._dictionary_data$.asObservable().pipe(
      map(entries =>
        entries.sort(function(a, b) {
          return a['sorting_form'][0] - b['sorting_form'][0];
        })
      )
    );
  }

  get config_value() {
    return this._config$.getValue();
  }

  get dataDict_value() {
    return this._dictionary_data$.getValue();
  }

  get categories$(): Observable<CategoryData> {
    return this._dictionary_data$.asObservable().pipe(
      map(entries => {
        const keys = uniq(entries.map(x => x.source));
        const categories: CategoryData = {};
        for (const key of keys) {
          if (key !== undefined)
            categories[key] = entries.filter(x => x.source === key);
        }
        const semantic_categories = uniq(
          entries.map(entry => {
            if (
              entry.theme &&
              entry.theme !== undefined &&
              typeof entry.theme === 'string'
            ) {
              return entry.theme.toLowerCase();
            }
          })
        ).sort();

        for (const cat of semantic_categories) {
          if (cat) {
            categories[cat] = entries.filter(entry => entry.theme === cat);
          }
        }

        const audioEntries = entries.filter(this.hasAudio);
        if (
          audioEntries.length > 0 &&
          (audioEntries.length < entries.length * 0.75 || META.browseAudio)
        ) {
          categories['audio'] = audioEntries;
        }
        return categories;
      })
    );
  }

  get category_keys$() {
    return this.categories$.pipe(map(cats => Object.keys(cats)));
  }
}
