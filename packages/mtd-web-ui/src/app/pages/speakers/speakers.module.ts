import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { SpeakersComponent } from './speakers.component';
import { SpeakersRoutingModule } from './speakers-routing.module';

@NgModule({
  declarations: [SpeakersComponent],
  imports: [CommonModule, SharedModule, SpeakersRoutingModule]
})
export class SpeakersModule {}
