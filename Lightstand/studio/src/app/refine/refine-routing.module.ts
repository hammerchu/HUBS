import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefinePage } from './refine.page';

const routes: Routes = [
  {
    path: '',
    component: RefinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefinePageRoutingModule {}
