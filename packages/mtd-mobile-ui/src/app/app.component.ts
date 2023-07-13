import { Component } from '@angular/core';
@Component({
  selector: 'mtd-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Search', url: '/search', icon: 'search' },
  ];

  constructor() {
    
  }
}
