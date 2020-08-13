import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OndemandPage } from './ondemand.page';

const routes: Routes = [
  {
    path: '',
    component: OndemandPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OndemandPageRoutingModule {}
