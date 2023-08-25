import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowsePageRoutingModule } from './browse-routing.module';

import { BrowsePage } from './browse.page';
import { SharedModule } from '../shared/shared.module';
import { BrowseService } from './browse.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowsePageRoutingModule,
    SharedModule,
  ],
  declarations: [BrowsePage],
  providers: [BrowseService],
})
export class BrowsePageModule {}
