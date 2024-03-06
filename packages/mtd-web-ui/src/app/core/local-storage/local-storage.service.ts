import { Injectable } from '@angular/core';
import { DataService } from '../core.module';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  prefix: string | null = null;
  
  constructor(private dataService: DataService) {
    this.dataService.$config.subscribe((config) => {
      if (config === null)
        throw "DataService yielded null config!";
      this.prefix = `${config.L1}-${config.L2}-${config.build}`;
    });
  }

  setItem(key: string, value: any) {
    if (this.prefix === null)
      throw "DataService not ready, no local storage available";
    localStorage.prefix(`${this.prefix}-${key}`, JSON.stringify(value));
  }

  getItem(key: string) {
    if (this.prefix === null)
      throw "DataService not ready, no local storage available";
    const item = localStorage.getItem(`${this.prefix}-${key}`);
    if (item !== null)
      return JSON.parse(item);
    return null;
  }

  removeItem(key: string) {
    if (this.prefix === null)
      throw "DataService not ready, no local storage available";
    localStorage.removeItem(`${this.prefix}-${key}`);
  }
}
