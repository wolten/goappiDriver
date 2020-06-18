import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';
const URL = environment.url;

@Pipe({
  name: 'imagenProducto'
})
export class ImagenProductoPipe implements PipeTransform {

  transform(img: string, tokenx: string): string {
    return `${URL}/api/platillo/${tokenx}/${img}`;
  }

}
