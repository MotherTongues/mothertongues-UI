import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowseComponent } from './browse.component';

const routes: Routes = [
  {
    path: ':start',
    component: BrowseComponent,
    data: { title: 'mtd.menu.browse' }
  },
  {
    path: '',
    redirectTo: '0',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseRoutingModule {}
