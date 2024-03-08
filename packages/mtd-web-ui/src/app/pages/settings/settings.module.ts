import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { SettingsContainerComponent } from './settings-container.component';

@NgModule({
  declarations: [SettingsContainerComponent],
  imports: [CommonModule, SharedModule]
})
export class SettingsModule {}
