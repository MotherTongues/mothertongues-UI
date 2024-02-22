import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../core/core.module';

interface Speakers {
  [id: string]: string;
}
export const SPEAKERS: Speakers = {
  vid: 'Verna DeMontigny',
  srh: 'Sandra Houle',
  afp: 'Albert Parisien Sr.',
  clh: 'Connie Henry'
};

@Component({
  selector: 'mtd-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: [
    './speakers.component.scss',
    '../../shared/layout/single/single.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeakersComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  speaker = 'vid';
  fullname = SPEAKERS;
  photos = {
    vid: 'assets/Verna_DeMontigny.jpg',
    srh: 'assets/Sandra_Houle.jpg',
    afp: 'assets/Albert_Parisien.jpg',
    clh: 'assets/Connie_Henry.jpg'
  };
  constructor(private route: ActivatedRoute, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      const speaker = paramMap.get('speaker');
      if (speaker !== null) {
        this.speaker = speaker;
        this.ref.markForCheck();
      }
    });
  }
}
