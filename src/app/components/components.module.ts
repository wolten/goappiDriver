import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MapaComponent } from './mapa/mapa.component';

@NgModule({
    declarations: [
        MapaComponent
    ],
    exports: [
        MapaComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ]
})
export class ComponentsModule { }
