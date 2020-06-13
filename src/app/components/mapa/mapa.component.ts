import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
declare var google;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements AfterViewInit{

  @Input() lat:  number;
  @Input() lng:  number;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor() {}
  

  ngAfterViewInit(){
    console.log('LATLNG:', this.lat, this.lng);
    this.addMap(this.lat, this.lng);
  }

  addMap(lat, long) {

    const latLng = new google.maps.LatLng(lat, long);
    const mapOptions = {
      center: latLng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    } 

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  } // ADD MAPA

  addMarker() {

    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    const content = '<p>This is your current position !</p>';
    const infoWindow = new google.maps.InfoWindow({ content });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  } // ADD MARKER
  
}
