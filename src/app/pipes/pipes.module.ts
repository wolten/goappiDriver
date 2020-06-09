import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { ImagenPipe } from './imagen.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { ImagenDocumentoPipe } from './imagen-documento.pipe';

@NgModule({
    declarations: [
        ImageSanitizerPipe,
        ImagenPipe,
        DomSanitizerPipe,
        ImagenDocumentoPipe
    ],
    exports: [
        ImageSanitizerPipe,
        ImagenPipe,
        DomSanitizerPipe,
        ImagenDocumentoPipe
    ]
})
export class PipesModule { }
