import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {

  @Input() lat: number;
  @Input() lng: number;


  constructor() { }

  ngOnInit() {
    console.log('mapa.component', this.lat, this.lng);
  }

}
