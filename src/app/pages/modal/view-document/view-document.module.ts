import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewDocumentPageRoutingModule } from './view-document-routing.module';

import { ViewDocumentPage } from './view-document.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewDocumentPageRoutingModule
  ],
  declarations: [ViewDocumentPage]
})
export class ViewDocumentPageModule {}
