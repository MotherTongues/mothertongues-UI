import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowsePage } from './browse.page';

const routes: Routes = [
  {
    path: '',
    component: BrowsePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowsePageRoutingModule {}
