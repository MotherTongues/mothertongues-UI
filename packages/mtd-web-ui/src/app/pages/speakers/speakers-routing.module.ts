import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpeakersComponent } from './speakers.component';

const routes: Routes = [
  {
    path: '',
    component: SpeakersComponent,
    data: { title: 'mtd.menu.speakers' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeakersRoutingModule {}
