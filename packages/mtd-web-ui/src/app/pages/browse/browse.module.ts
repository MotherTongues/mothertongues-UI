import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseComponent } from './browse.component';
import { SharedModule } from '../../shared/shared.module';
import { BrowseRoutingModule } from './browse-routing.module';

@NgModule({
  declarations: [BrowseComponent],
  imports: [CommonModule, SharedModule, BrowseRoutingModule]
})
export class BrowseModule {
  displayNav = true;
}
