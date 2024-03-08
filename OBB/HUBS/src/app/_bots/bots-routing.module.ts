import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BotsPage } from './bots.page';

const routes: Routes = [
  {
    path: '',
    component: BotsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BotsPageRoutingModule {}
