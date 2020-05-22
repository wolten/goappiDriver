import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
})
export class MapaComponent implements OnInit {
  @Input() lat: number;
  @Input() lng: number;
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  currentMapTrack = null;
  isTracking = false;
  trackedRoute = [];
  positionSubscription: Subscription;


  constructor(private geoLocation:Geolocation) { }

  ngOnInit(){
    
    this.geoLocation.getCurrentPosition().then( pos => {

      console.log('mapa.component', pos.coords.latitude, pos.coords.longitude);
      this.addMap(pos.coords.latitude, pos.coords.longitude);
    });


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
    

  }
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

  }
  
}
