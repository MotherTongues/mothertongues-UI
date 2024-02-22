import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RandomComponent } from './random.component';

const routes: Routes = [
  {
    path: '',
    component: RandomComponent,
    data: { title: 'mtd.menu.random' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RandomRoutingModule {}
