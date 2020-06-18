import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryPageRoutingModule } from './delivery-routing.module';

import { DeliveryPage } from './delivery.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryPageRoutingModule,
    PipesModule
  ],
  declarations: [DeliveryPage]
})
export class DeliveryPageModule {}
