import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  usuario: Usuario = {};
  cargandoGeo = false;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit()
  {
    this.usuario = this.usuarioService.getUsuario();
  }

  changeDisponibilidad()
  {
    if(!this.usuario.status_drive){
      this.cargandoGeo = false;
      return;
    }

    this.cargandoGeo = true;
  }


}
