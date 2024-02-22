import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IntroductionComponent } from './introduction.component';

const routes: Routes = [
  {
    path: '',
    component: IntroductionComponent,
    data: { title: 'mtd.menu.introduction' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntroductionRoutingModule {}
