import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { IntroductionComponent } from './introduction.component';
import { IntroductionRoutingModule } from './introduction-routing.module';

@NgModule({
  declarations: [IntroductionComponent],
  imports: [CommonModule, SharedModule, IntroductionRoutingModule]
})
export class IntroductionModule {}
