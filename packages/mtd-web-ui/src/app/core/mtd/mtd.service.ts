import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Config, DictionaryData } from '../models';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { uniq } from 'lodash';
import { environment } from '../../../environments/environment';
import { META } from '../../../config/config';
// import { AlertController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class MtdService {
  _dictionary_data$ = new BehaviorSubject<DictionaryData[]>(window['dataDict']);
  _config$ = new BehaviorSubject<Config>(window['config']);
  slug: string;
  remoteData$: any;
  remoteConfig$: any;
  base: string = environment.apiBaseURL;
  // remote: string = environment.remoteSlug;
  constructor(private http: HttpClient) {
    this.slug = this.slugify(this._config$.getValue().L1.name);
    // this.slug = this.remote
    // console.log(this.slug)
    if (environment.remoteData) {
      this.remoteData$ = this.http.get(
        `${environment.remoteData}?name=${this.slug}&only-data=true`,
        { observe: 'response' }
      );
    } else {
      this.remoteData$ = of(false);
    }

    if (environment.remoteConfig) {
      this.remoteConfig$ = this.http.get(
        `${environment.remoteConfig}?name=${this.slug}&only-config=true`,
        { observe: 'response' }
      );
    } else {
      this.remoteConfig$ = of(false);
    }

    // TODO: if in storage
    if (environment.remoteData && environment.remoteConfig) {
      // TODO: check remote build is newer
      this.remoteConfig$.subscribe(x => {
        if (x.status === 200) {
          // TODO: and storage.config.build < x.build
          this._config$.next(x.body);
          this.remoteData$.subscribe(y => {
            if (y.status === 200) {
              this.presentUpdateAlert();
              // setTimeout(() => {
              this._dictionary_data$.next(y.body);
              // }, 3000)
            } else {
              this.presentUpdateFailedAlert();
              // TODO: return error message
            }
          });
        } else {
          this.presentUpdateFailedAlert();
          // TODO: return error message
        }
      });
    } else {
      // TODO: try and update from remote
      this.remoteConfig$.subscribe(x => {
        if (x.status === 200) {
          this._config$.next(x.body);
          this.remoteData$.subscribe(y => {
            if (y.status === 200) {
              this._dictionary_data$.next(y.body);
            } else {
              // return error message
            }
          });
        } else {
          // return error message
        }
      });
    }
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

  private shuffle(array) {
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

  slugify(text) {
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

  hasAudio(entry) {
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

  get categories$(): Observable<object> {
    return this._dictionary_data$.asObservable().pipe(
      map(entries => {
        const keys = uniq(entries.map(x => x['source']));
        const categories: object = {};
        for (const key of keys) {
          categories[key] = entries.filter(x => x['source'] === key);
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
          categories['audio'] = {};
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
