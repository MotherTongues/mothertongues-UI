import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
@Component({
  selector: 'mtd-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Search', url: '/search', icon: 'search' },
    { title: 'Browse', url: '/browse', icon: '' },
    { title: 'About', url: '/about', icon: 'information-circle' },
  ];
  title = 'Mother Tongues Dictionary'
  constructor(public dataService: DataService) {
    
  }
  ngOnInit(){
    this.dataService.$config.subscribe((config) => {
      console.log(config)
      this.title = config.L1
    })
  }
}
