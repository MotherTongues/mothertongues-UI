import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { PeopleComponent } from './people.component';
import { PeopleRoutingModule } from './people-routing.module';

@NgModule({
  declarations: [PeopleComponent],
  imports: [CommonModule, SharedModule, PeopleRoutingModule]
})
export class PeopleModule {}
