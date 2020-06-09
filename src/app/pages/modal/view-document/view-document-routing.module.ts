import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewDocumentPage } from './view-document.page';

const routes: Routes = [
  {
    path: '',
    component: ViewDocumentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewDocumentPageRoutingModule {}
