import { NgModule } from '@angular/core';
import { ImageSanitizerPipe } from './image-sanitizer.pipe';
import { ImagenPipe } from './imagen.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { ImagenDocumentoPipe } from './imagen-documento.pipe';
import { ImagenProductoPipe } from './imagen-producto.pipe';
import { TimeAgoPipe } from './time-ago.pipe';

@NgModule({
    declarations: [
        ImageSanitizerPipe,
        ImagenPipe,
        DomSanitizerPipe,
        ImagenDocumentoPipe,
        ImagenProductoPipe,
        TimeAgoPipe,
    ],
    exports: [ 
        ImageSanitizerPipe,
        ImagenPipe,
        DomSanitizerPipe,
        ImagenDocumentoPipe,
        ImagenProductoPipe,
        TimeAgoPipe
    ]
})
export class PipesModule { }
