import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/interfaces';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  usuario: Usuario = {};
  cargandoGeo = false;

  constructor(private usuarioService: UsuarioService,
    private gps: Geolocation) { }

  ngOnInit() {

    this.usuario = this.usuarioService.getUsuario();

    this.cargandoGeo = true;

    this.gps.getCurrentPosition().then((resp) => {
    
      this.cargandoGeo = false;
      this.usuario.lat = resp.coords.latitude;
      this.usuario.lng = resp.coords.longitude;
      console.log('GPS:', this.usuario);

    }).catch((error) => {
      console.log('Error getting location', error);
      this.cargandoGeo = false;
    });

  }

  changeDisponibilidad()
  {
    if(!this.usuario.status_drive){
      this.cargandoGeo = false;
      return;
    }
  }


}
