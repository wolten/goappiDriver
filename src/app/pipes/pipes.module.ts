import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { ImagenPipe } from './imagen.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { ImagenDocumentoPipe } from './imagen-documento.pipe';
import {TimeAgoPipe} from 'time-ago-pipe';
import { ImagenProductoPipe } from './imagen-producto.pipe';

@NgModule({
    declarations: [
        ImageSanitizerPipe,
        ImagenPipe,
        DomSanitizerPipe,
        ImagenDocumentoPipe,
        TimeAgoPipe,
        ImagenProductoPipe
    ],
    exports: [
        ImageSanitizerPipe,
        ImagenPipe,
        DomSanitizerPipe,
        ImagenDocumentoPipe,
        TimeAgoPipe,
        ImagenProductoPipe
    ]
})
export class PipesModule { }
