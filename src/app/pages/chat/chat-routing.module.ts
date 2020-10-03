import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';
import { AutosizeModule } from 'ngx-autosize';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AutosizeModule
  ],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
