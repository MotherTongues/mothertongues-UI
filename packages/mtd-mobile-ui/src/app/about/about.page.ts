import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataService } from '../data.service';
import { LanguageConfigurationExportFormat } from '@mothertongues/search';
import { Subject } from 'rxjs';

@Component({
    selector: 'mtd-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AboutPage implements OnInit {
  $config: Subject<LanguageConfigurationExportFormat | null>;
  constructor(public dataService: DataService) {}

  ngOnInit() {
    this.$config = this.dataService.$config;
  }
}
