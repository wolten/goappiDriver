import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

const URL = environment.url;

@Pipe({
  name: 'imagenDocumento'
})
export class ImagenDocumentoPipe implements PipeTransform {

  transform(img: string, tokenx: string): string {
    return `${URL}/api/documento/${tokenx}/${img}`;
  } 

}
