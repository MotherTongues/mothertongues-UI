import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ExportLanguageConfiguration } from '../../config/config';
import { Subject } from 'rxjs';

@Component({
  selector: 'mtd-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.css'],
})
export class AboutPage implements OnInit {
  $config: Subject<ExportLanguageConfiguration>; 
  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.$config = this.dataService.$config
  }

}
