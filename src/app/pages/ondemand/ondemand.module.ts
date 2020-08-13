import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OndemandPageRoutingModule } from './ondemand-routing.module';
import { OndemandPage } from './ondemand.page';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OndemandPageRoutingModule,
    PipesModule,
    ComponentsModule
  ],
  declarations: [OndemandPage]
})
export class OndemandPageModule {}
