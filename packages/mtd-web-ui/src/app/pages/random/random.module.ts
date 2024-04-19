import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomComponent } from './random.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [RandomComponent],
  imports: [CommonModule, SharedModule],
})
export class RandomModule {}
