import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config, DictionaryData } from '../models';
import { uniq } from 'lodash';
import { environment } from '../../../environments/environment';
import { META } from '../../../config/config';

interface CategoryData {
  [category: string]: Array<DictionaryData>
}

@Injectable({ providedIn: 'root' })
export class MtdService {
  // @ts-ignore
  _dictionary_data$ = new BehaviorSubject<DictionaryData[]>(window['dataDict']);
  // @ts-ignore
  _config$ = new BehaviorSubject<Config>(window['config']);
  slug: string;
  base: string = environment.apiBaseURL;
  constructor() {
    this.slug = this.slugify(this._config$.getValue().L1.name);
  }

  async presentUpdateAlert() {
    console.log('alert');
    // const alert = await this.alertCtrl.create({
    //     header: 'Success',
    //     message: 'New words have been updated from the server.',
    //     buttons: ['OK']
    // });
    // await alert.present();
  }

  async presentUpdateFailedAlert() {
    console.log('alert');
    // const alert = await this.alertCtrl.create({
    //     header: 'Oops',
    //     message: "There might be new words, but we couldn't check. Try connecting to the internet.",
    //     buttons: ['OK']
    // });
    // await alert.present();
  }

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

  /* FIXME: we use slugify from transliteration elsewhere, why not here */
  slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '-') // Replace all non-word chars with -
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
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
