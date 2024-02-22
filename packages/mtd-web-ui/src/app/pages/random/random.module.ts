import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomComponent } from './random.component';
import { SharedModule } from '../../shared/shared.module';
import { RandomRoutingModule } from './random-routing.module';

@NgModule({
  declarations: [RandomComponent],
  imports: [CommonModule, SharedModule, RandomRoutingModule]
})
export class RandomModule {}
